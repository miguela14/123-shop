const { Business, Cart, Product, User } = require("../models");
const jwt = require("jsonwebtoken");
const { signToken, authToken } = require("../utils/auth");
const { default: mongoose } = require("mongoose");
const { Order } = require("../models/Order");
const { PubSub, withFilter } = require("graphql-subscriptions");
const pubsub = new PubSub();
const resolvers = {
  Query: {
    getAllUsers: async () => {
      const users = await User.find({});

      return users;
    },
    // GET user by ID
    getUser: async (_, { userId }) => {
      const user = await User.findById(userId);
      return user;
    },
    // GET all products
    getProducts: async () => {
      const products = await Product.find();
      return products;
    },
    // GET cart by user ID
    getCartByUser: async (_, { userId }) => {
      const cart = await Cart.findOne({ user: userId }).populate(
        "item.product"
      );
      return cart;
    },
    // GET business by ID
    getBusiness: async (_, { businessId }) => {
      const business = await Business.findById(businessId);
      return business.populate("products");
    },
    getBusinessByUser: async (_, { userId }) => {
      let foundBusiness = await Business.find({ user_id: userId });
      return foundBusiness;
    },
    getAllBusiness: async () => {
      const allBusiness = await Business.find({});
      return allBusiness;
    },
    authUser: async (_, { token }) => {
      try {
        let decodedToken = authToken(token);
        if (!decodedToken) {
          return { authed: false, userId: null };
        }
        return { authed: true, userId: decodedToken.data._id };
      } catch (error) {
        throw new Error("Auth failed resolvers.js ln:42");
      }
    },
  },

  Mutation: {
    // POST login user
    loginUser: async (_, { email, password }) => {
      let errMsg = "";
      try {
        const user = await User.findOne({ email });
        if (!user) {
          errMsg = "Incorrect details";
          throw new Error({ message: "Incorrect details" });
        }
        const passwordAuthed = await user.isCorrectPassword(password);
        if (!passwordAuthed) {
          errMsg = "Incorrect details";
          throw new Error({ message: "Incorrect details" });
        }
        return signToken(user);
      } catch (error) {
        throw new Error(errMsg);
      }
    },
    // POST new User
    createUser: async (_, { userInput }) => {
      console.log({ userInput });
      try {
        const foundUser = await User.findOne({ email: userInput.email });
        if (foundUser) {
          throw new Error("Incorrect credentials");
        }
        const user = new User(userInput);
        let token;
        user.userInput = userInput;
        await user.save();
        if (user) {
          token = signToken(user);
        }

        return token;
      } catch (error) {
        let err = error.message || "Error creating a user";
        throw new Error(error);
      }
    },

    // POST new Product
    createProduct: async (_, { productInput }) => {
      try {
        const product = new Product(productInput);
        const business = await Business.findById(productInput.business_id);
        if (!business) {
          throw new Error("No business here");
        }
        await product.save();
        business.products.push(product);
        await business.save();
        return product;
      } catch (error) {
        throw new Error(error);
      }
    },
    createMultipleProducts: async (_, { productInput }) => {
      const ObjectId = mongoose.Types.ObjectId;
      const business_id = new ObjectId(productInput.business_id);

      const productsWithBusinessId = productInput.products.map((item) => {
        return {
          ...item,
          business_id,
        };
      });
      try {
        let products = await Product.insertMany(productsWithBusinessId);
        let business = await Business.findById(productInput.business_id);
        let user = await User.findById(business.user_id);
        products.forEach((product) => {
          business.products.push(product);
        });
        user.first_time_log = false;
        user.save();
        business.save();

        return products;
      } catch (error) {
        throw new Error(error);
      }
    },
    //
    addToCart: async (_, { userId, productId, quantity }) => {
      let cart = await Cart.findOne({ user: userId });

      if (!cart) {
        // Create new cart if none exist for the user
        cart = new Cart({
          user: userId,
          item: [{ product: productId, quantity }],
        });
      } else {
        // Add the item to the existing cart
        cart.item.push({ product: productId, quantity });
      }

      await cart.save().populate("item.product");
      return cart;
    },
    createBusiness: async (_, { businessInput }) => {
      const business = new Business(businessInput);
      await business.save();
      return business;
    },
    updateBusinessAddress: async (
      _,
      { businessId, businessName, address, description }
    ) => {
      const updatedBusiness = await Business.findByIdAndUpdate(
        businessId,
        {
          business_name: businessName,
          description,
          address,
        },
        { new: true }
      );
      return updatedBusiness;
    },
    placeOrder: async (_, { userId, businessId, orderDetails }) => {
      const newOrder = new Order({
        user: userId,
        business: businessId,
        orderDetails,
      });
      const savedOrder = await newOrder.save();
      console.log({ savedOrder });
      pubsub.publish("NEW_ORDER", { newOrder: savedOrder });
      return savedOrder;
    },
  },
  Subscription: {
    newOrder: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["NEW_ORDER"]),
        (payload, variables) => {
          return payload.newOrder.business.toString() === variables.businessId;
        }
      ),
    },
  },
};

module.exports = resolvers;
