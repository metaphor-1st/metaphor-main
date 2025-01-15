import "./medicineCard.css";
import kakaoImageSearch from "../../api/kakaoSearch";
import defaultImg from "../../images/defaultImg.svg";
import { useState, useEffect } from "react";

function MedicineCard({ name, ingredients }) {
  const [imageUrl, setImageUrl] = useState(defaultImg);
  const [isLoading, setIsLoading] = useState(true);

  // 프록시 URL로 변환하는 함수
  const getProxyUrl = (url) => {
    // 네이버 블로그나 포스트의 이미지는 직접 접근이 제한되어 있어서
    // 프록시 서버를 따로 사용해야 함
    // 또는 방법 2: 이미지 프록시 서비스 사용
     return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
  };

  useEffect(() => {
    let isMounted = true;

    const getImage = async () => {
      setIsLoading(true);
      try {
        const images = await kakaoImageSearch(name);

        if (images && images.length > 0 && isMounted) {
          const originalUrl = images[0].image_url;
          const proxyUrl = getProxyUrl(originalUrl);
       
          setImageUrl(proxyUrl);
        } else if (isMounted) {
        
          setImageUrl(defaultImg);
        }
      } catch (error) {
        console.error(`이미지 검색 실패: `, error.message);
        if (isMounted) {
          setImageUrl(defaultImg);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    getImage();

    return () => {
      isMounted = false;
    };
  }, [name]);


  return (
    <div className="MedicineWrap">
      <div className="ImgBox">
        {isLoading ? (
          <div>로딩중...</div>
        ) : (
          <img
            key={imageUrl}
            src={imageUrl}
            alt={name}
            onError={(e) => {
              console.log(`이미지 로드 실패`);
              e.target.src = defaultImg;
            }}
            crossOrigin="anonymous"  // CORS 헤더 추가
          />
        )}
      </div>
      <div className="MedicineBox">
        <div className="MedicineName">{name}</div>
        <div className="MedicineLine"></div>
        <div className="MedicineContent">
          <div className="MedicineInfo">
            <div>약 성분</div>
          </div>
          <div className="MedicineInfoText">
            <div>{ingredients}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicineCard;