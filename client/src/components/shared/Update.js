import React from "react";

function Update({ width = "21px", height = "21px" }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.2246 5.13075L10.4402 13.9138C9.56541 14.7885 6.96873 15.1935 6.38862 14.6135C5.80852 14.0335 6.20446 11.4372 7.07922 10.5626L15.8729 1.77031C16.0897 1.53375 16.3523 1.3436 16.6447 1.2113C16.9371 1.079 17.2533 1.00728 17.5742 1.00053C17.895 0.993777 18.2139 1.05209 18.5116 1.17197C18.8093 1.29185 19.0797 1.47083 19.3063 1.69805C19.5329 1.92527 19.7112 2.19603 19.8302 2.49401C19.9493 2.792 20.0068 3.11101 19.9992 3.43182C19.9915 3.75262 19.9189 4.06859 19.7858 4.36057C19.6527 4.65256 19.4618 4.91457 19.2246 5.13075Z"
        stroke="#0085FF"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.40385 3.19214H4.73504C3.74444 3.19214 2.79448 3.58564 2.09402 4.2861C1.39357 4.98657 1 5.93658 1 6.92718V16.2648C1 17.2554 1.39357 18.2054 2.09402 18.9058C2.79448 19.6063 3.74444 19.9998 4.73504 19.9998H15.0064C17.07 19.9998 17.8077 18.3191 17.8077 16.2648V11.596"
        stroke="#0085FF"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export default Update;