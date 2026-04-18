function Logo() {
  return (
    <div className="logo-wrap">
      <svg
        width="60"
        height="60"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Maryama Turbans Logo"
      >
        <defs>
          <linearGradient id="turbanGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0B1F4D" />
            <stop offset="100%" stopColor="#23438A" />
          </linearGradient>
        </defs>

        <circle cx="32" cy="32" r="30" fill="white" stroke="#0B1F4D" strokeWidth="2.5" />

        <path
          d="M16 31
             C18 22, 25 17, 33 17
             C41 17, 47 21, 49 29
             C45 27, 40 27, 35 29
             C30 31, 25 33, 20 32
             C18.5 31.8, 17 31.5, 16 31Z"
          fill="url(#turbanGrad)"
        />

        <path
          d="M14 35
             C18 33, 22 33.5, 26 35
             C30 36.5, 34 38.5, 40 38.5
             C45 38.5, 49 37.2, 51 35.5
             C49.5 42.5, 43 47, 34 47
             L28 47
             C20 47, 15 42.5, 14 35Z"
          fill="url(#turbanGrad)"
        />

        <path
          d="M28 24
             C31 23.5, 34 24, 36 25.5
             C38 27, 39.5 28.5, 43 28.8"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        <path
          d="M24 42
             C25.2 44.5, 28.2 46.5, 32 46.5
             C35.8 46.5, 38.7 44.6, 40 42"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>

      <div className="logo-text">
        <span className="logo-title">MARYAMA</span>
        <span className="logo-subtitle">TURBANS</span>
      </div>
    </div>
  );
}

export default Logo;