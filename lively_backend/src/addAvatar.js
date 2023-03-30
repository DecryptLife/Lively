const addAvatar = () => {
  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageChange(e)}
      />
    </div>
  );
};

export default addAvatar;
