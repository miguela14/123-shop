import React from "react";

function Trash({ width = "18px", height = "20px" }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.13951 7.14307H5.71094V15.7145H7.13951V7.14307Z"
        fill="#FF2F09"
      />
      <path d="M11.4286 7.14307H10V15.7145H11.4286V7.14307Z" fill="#FF2F09" />
      <path
        d="M0 2.85693V4.28551H1.42857V18.5712C1.42857 18.9501 1.57908 19.3135 1.84699 19.5814C2.1149 19.8493 2.47826 19.9998 2.85714 19.9998H14.2857C14.6646 19.9998 15.028 19.8493 15.2959 19.5814C15.5638 19.3135 15.7143 18.9501 15.7143 18.5712V4.28551H17.1429V2.85693H0ZM2.85714 18.5712V4.28551H14.2857V18.5712H2.85714Z"
        fill="#FF2F09"
      />
      <path d="M11.4252 0H5.71094V1.42857H11.4252V0Z" fill="#FF2F09" />
    </svg>
  );
}

export default Trash;
