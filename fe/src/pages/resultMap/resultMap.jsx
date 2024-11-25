import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance'; // axiosInstance 가져오기
import GoogleMap from '../../api/googleMap';
import Header from '../../components/header/header';
import drugImg from '../../images/타이레놀.png';
import './resultMap.css';

function ResultMap() {
  const [drugInfo, setDrugInfo] = useState(null); // 약물 정보 상태
  const [locations, setLocations] = useState([]); // 약물 위치 상태
  const [error, setError] = useState(null); // 에러 상태

  const pillId = 1; // 테스트를 위해 정적인 pillId 사용 (실제 pillId를 동적으로 받아야 함)

  useEffect(() => {
    const fetchDrugLocation = async () => {
      try {
        // API 요청 보내기
        const response = await axiosInstance.post(`/map/pill/${pillId}`);
        setDrugInfo(response.data); // 약물 정보 저장
        setLocations(response.data.locations); // 약물 위치 저장
      } catch (err) {
        setError(err.response?.data?.error || '데이터를 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchDrugLocation(); // API 호출
  }, [pillId]);

  if (error) {
    return <div>Error: {error}</div>; // 에러 메시지 표시
  }

  return (
    <div>
      <Header />
      <div className="MapContainer" style={{ position: 'relative', width: '100%' }}>
        <GoogleMap locations={locations} /> {/* 약물 위치 전달 */}
        {drugInfo && (
          <div className="ResultCard">
            <div className="ImageRect">
              <img src={drugInfo.gongdeokLocation ? drugInfo.gongdeokLocation.image : ''} alt="DrugImg" />
            </div>
            <div>
              <h2>약물 정보</h2>
              <p>이름: {drugInfo.pillName || '정보 없음'}</p>
              <p>유형: {drugInfo.type || '정보 없음'}</p>
              <p>재고: {drugInfo.stock || '정보 없음'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultMap;