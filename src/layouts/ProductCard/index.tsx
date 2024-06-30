import useTicker from '../../hooks/useTicker';
import tools from '../../utils/tools';

const index = ({ product }) => {
  const { calcPrice } = useTicker();
  return (
    <a className="categoryCard" href={`/product/${product.slug}`}>
      <span className="catCardTag catCardStatus">{product.status == 1 ? 'موجود' : 'ناموجود'}</span>
      {product.discountPrice > 0 && <span className="catCardTag">-{product.price - product.discountPrice}</span>}
      <div className="productCardImgContainer">
      <img src={product?.medias.find(e => e.code == 'main')?.url} className="catCardardImg" onMouseEnter={(e: any) => {
        if (product?.medias.length > 1) {
          e.target.src = product?.medias[1].url;
        }
      }} onMouseLeave={(e: any) => e.target.src = product?.medias.find(e => e.code == 'main')?.url}/>
      </div>
      <div className="catCardInfo">
        <h6 className="catCardName">{product.title}</h6>
        <div className="priceSec">
          <h6 className="catCardPrice">{calcPrice(product.price)} DHs</h6>
          <span>~</span>
          <span className="catPersianPrice">
            <h6 className="tablePriceNumber">{tools.formatPrice(product.priceToman)} </h6>
            <h6 className="tablePriceTexe">تومان</h6>
          </span>
        </div>
      </div>
    </a>
  );
};

export default index;
