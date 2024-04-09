
const ConfirmResetPasswordPage = () => {
  return (
    <div className="bg-lightpurple-login w-[100vw] h-[100vh] md:p-[50px]">
    <div className="z-[1] h-[90%] flex items-center justify-center md:w-[100%]">
      <div className="relative bg-white p-9 rounded-lg shadow-md w-[400px]  min-w-md min-w-[350px] pt-1 h-[100%] md:flex md:flex-col md:items-center md:h-[90%] md:w-[70%]">
        <div className="self-center  text-gray-700 font-bold text-4xl mt-10 flex justify-evenly md:flex md:w-[80%] ">
          <p>Reset password</p>
        </div>
        <div className="self-center mt-4 flex mb-4 justify-evenly md:flex md:w-[80%] md:mb-[100px]">
          <p>
            Please enter the email address you would like your password reset
            link sent to
          </p>
        </div>
        <form action="" className="w-full md:w-[90%]">
          <div className="mb-4 md:w-[100%] ">
            <label
              htmlFor="new-password"
              className="block text-gray-700 text-sm font-bold mb-2 "
            >
              New Password
            </label>
            <input
              type="text"
              placeholder="Enter new password"
              className="appearance-none w-full bg-transparent border-0 border-b border-gray-700 focus:outline-none py-1 md:mb-[20px]"
              id="new-password"
            />
          </div>
          <div className="mb-4 md:w-[100%] ">
            <label
              htmlFor="confirm-password"
              className="block text-gray-700 text-sm font-bold mb-2 "
            >
              Confirm Password
            </label>
            <input
              type="text"
              placeholder="Enter password"
              className="appearance-none w-full bg-transparent border-0 border-b border-gray-700 focus:outline-none py-1 md:mb-[20px]"
              id="confirm-password"
            />
          </div>
          
          <div>
            <button
              className="text-gray-700 w-full hover:bg-lightpurple bg-lightpurple-login rounded-3xl font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
              type="button"
            >
             Reset password
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  )
}

export default ConfirmResetPasswordPage