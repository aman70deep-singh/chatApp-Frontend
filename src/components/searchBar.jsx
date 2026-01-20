const SearchBar = ({ search, onSearch }) => {
    return (
        <div className="p-3 border-b border-gray-700">
            <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[#2A3942] text-white outline-none placeholder-gray-400"
            />
        </div>
    )
}
export default SearchBar;