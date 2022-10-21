import React, { useState } from 'react';
import '../src/css/App.scss';
import logo from '../src/assets/logo_2x.png';
import signIcon from '../src/assets/createSign_2x.png';
import userImage from '../src/assets/userImage_2x.png';
import moon from '../src/assets/moon_2x.png';
import cx from 'classnames';

function App() {
  const [focus, setFocus] = useState('1');
  return (
    <div className="App">
      <div className="h-screen bg-gray-200">
        <div className="flex w-full h-screen">
          <div className="w-[86px] h-screen bg-gray-500">
            <div className="flex flex-col justify-between gap-56">
              <div className="flex flex-col justify-center items-center pt-[18px] gap-[18px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-9 h-9 text-[#C0D2DD] cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <button
                  className={cx('sidebarBtn', { focus: focus === '1' })}
                  onClick={() => setFocus('1')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-9 h-9 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>

                  <span className="text-white">開始簽署</span>
                </button>
                <button
                  className={cx('sidebarBtn', { focus: focus === '2' })}
                  onClick={() => setFocus('2')}
                >
                  <img src={signIcon} alt="signIcon on screen" />
                  <span className="text-white">開始簽署</span>
                </button>
              </div>
              <div className="flex flex-col justify-center items-center gap-2.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-9 h-9 bg-white rounded-[10px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-9 h-9 bg-white rounded-[10px]"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                    clipRule="evenodd"
                  />
                </svg>
                <img className="w-9 h-9" src={userImage} alt="user's image" />
              </div>
            </div>
          </div>
          <div className="w-full h-[72px] bg-green-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-[#C0D2DD]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>

            <button className="rounded-[10px] bg-[#C0D2DD] py-2 px-3 text-white">
              下一步
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
