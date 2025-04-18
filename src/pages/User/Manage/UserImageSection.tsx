import React from 'react';

interface UserImageSectionProps {
  image: {
    data?: File;
    preview?: string;
  };
  setImage: React.Dispatch<React.SetStateAction<{
    data?: File;
    preview?: string;
  }>>;
}

const UserImageSection: React.FC<UserImageSectionProps> = ({ image, setImage }) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage({
        data: e.target.files[0],
        preview: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  return (
    <section className="bottom">
      <h6 className="dashBoardTitle">تصویر کاربر</h6>
      <div className="AddInfoContainer">
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
        />
        {image.preview && (
          <div className="image-preview-container">
            <img src={image.preview} className='maxWidth100' alt="عکس کاربر" />
          </div>
        )}
      </div>
    </section>
  );
};

export default UserImageSection;
