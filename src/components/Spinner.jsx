
const Spinner = ({ size = "w-6 h-6", color = "border-t-green-500", className = "" }) => {
    return (
        <div className={`flex justify-center items-center ${className}`}>
            <div
                className={`${size} border-2 border-gray-300 ${color} rounded-full animate-spin`}
            ></div>
        </div>
    );
};

export default Spinner;
