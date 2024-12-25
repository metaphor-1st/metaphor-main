import express from "express";
import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

import { v4 as uuidv4 } from "uuid"; // uuid 모듈 불러오기

// Prisma 클라이언트 초기화
const prisma = new PrismaClient();

// 환경 변수 로드
dotenv.config();
const app = express();

app.use(cors());

//req.body와 POST 요청을 해석하기 위한 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//뷰 엔진 설정
//app.set("views", __dirname + "/views");         //뷰 디렉터리를 views로 설정
//app.set('view engine', 'ejs');

//홈페이지 라우트
app.get("/", (req, res) => {
  res.render("home");
});

// 사용자 정보 생성
app.post("/user", (req, res) => {
  try {
    console.log("Request body:", req.body);
    const userId = uuidv4(); //userId 생성
    const userInfoRequest = {
      userId,
      bornYear: req.body.bornYear || null,
      sex: req.body.sex,
      message: "사용자 정보 생성 요청 완료",
    };

    // 필수 데이터 검증
    if (!userInfoRequest.bornYear) {
      return res.status(400).json({
        error: "출생년도는 필수 입력 항목입니다.",
      });
    }

    res.status(201).json(userInfoRequest);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "사용자 정보 생성 중 오류 발생",
      message: error.message,
    });
  }
});

// 불편함 정보 생성
app.post("/user/:userId/pain", (req, res) => {
  try {
    const userId = req.params.userId;
    const painInfoRequest = {
      userId: userId,
      pain: req.body.pain || null,
      description: req.body.description || null,
    };

    // 필수 데이터 검증
    const missingFields = Object.keys(painInfoRequest).filter(
      key => key !== "userId" && painInfoRequest[key] === null
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `필수 필드 누락: ${missingFields.join(", ")}`,
      });
    }

    console.log(painInfoRequest); //정보 확인용

    res.status(201).json(painInfoRequest);
  } catch (error) {
    res.status(500).json({
      error: "불편함 정보 생성 중 오류 발생",
      message: error.message,
    });
  }
});

//복용중인 약물 정보 생성
app.post("/user/:userId/pain/medi", (req, res) => {
  try {
    const userId = req.params.userId;
    const { mediTF, description } = req.body;
    const mediInfoRequest = {
      userId: userId,
      mediTF: mediTF,
      taken_medi: mediTF ? description : null,
    };

    console.log(mediInfoRequest);

    res.status(201).json(mediInfoRequest);
  } catch (error) {
    res.status(500).json({
      error: "복용중인 약물 정보 생성 중 오류 발생",
      message: error.message,
    });
  }
});

// 약물 정보 조회
app.get("/user/:userId/pain/medi/:mediId", (req, res) => {
  try {
    const { userId, mediId } = req.params;
    const mediInfoResponse = {
      userId: userId,
      mediId: mediId,
      mediName: req.query.mediName || null,
      description: req.query.description || null,
    };

    if (!mediInfoResponse.mediName) {
      return res.status(400).json({
        error: "약물 이름은 필수 입력 항목입니다.",
      });
    }

    res.status(200).json(mediInfoResponse);
  } catch (error) {
    res.status(500).json({
      error: "약물 정보 조회 중 오류 발생",
      message: error.message,
    });
  }
});

// 약물 세부 정보 조회
app.get("/user/:userId/pain/medi/:mediId/pill/:pillId", (req, res) => {
  try {
    const { userId, mediId, pillId } = req.params;
    const pillInfoResponse = {
      userId: userId,
      mediId: mediId,
      pillId: pillId,
      pillName: req.query.pillName || null,
      description: req.query.description || null,
    };

    if (!pillInfoResponse.pillName) {
      return res.status(400).json({
        error: "약물 이름은 필수 입력 항목입니다.",
      });
    }

    res.status(200).json(pillInfoResponse);
  } catch (error) {
    res.status(500).json({
      error: "약물 세부 정보 조회 중 오류 발생",
      message: error.message,
    });
  }
});

// 위치 데이터 저장소
let userLocationData = {};

// 위치 데이터 저장 
app.post("/user/:userId/location", (req, res) => {
  const { userId } = req.params;
  const { latitude, longitude } = req.body;

  console.log("Received data:", req.body);

  if (!userId) {
    console.error("userId가 누락되었습니다.");
    return res.status(400).json({ error: "userId가 누락되었습니다." });
  }

  if (latitude === undefined || longitude === undefined) {
    console.error("요청 데이터가 유효하지 않습니다:", req.body);
    return res.status(400).json({ error: "요청 데이터가 유효하지 않습니다." });
  }


  // 데이터 저장
  userLocationData[userId] = { latitude, longitude };
  console.log(`데이터 저장 완료:`, userLocationData[userId]);

  res.status(200).json({ message: "위치 데이터 저장 성공" });
});

// 위치 데이터 조회 
app.get("/user/:userId/location", (req, res) => {
  const { userId } = req.params;

  if (!userLocationData[userId]) {
    return res.status(404).json({ error: "데이터를 찾을 수 없습니다" });
  }

  res.status(200).json(userLocationData[userId]);
});

//특정 약물 ID로 약물 위치 조회
app.post("/map/pill/:pillId", async (req, res) => {
  //pillID 선택함
  const { pillId } = req.params;
  try {
    //pillId에 해당하는 pill찾기
    const pill = await prisma.pill.findUnique({
      where: { pillId: Number(pillId) },
    });

    //pill없을 시 에러 반환
    if (!pill) {
      return res.status(404).send({ error: "Pill not found" });
    }

    //pillName과 일치하는 location 찾음
    const locations = await prisma.location.findMany({
      where: {
        medi: pill.pillName, //pillName과 medi 일치여부 확인
      },
    });

    const gongdeokLocation = {
      latitude: 37.550339,
      longitude: 126.926231,
    };

    res.send({
      locations,
      gongdeokLocation,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "And error occurred while retreieving locations" });
  }
});

//약물 위치 및 세부 정보 조회
app.get("/map/medi/:mediId/location/:locationId", async (req, res) => {
  const { mediId, locationId } = req.params;

  try {
    const location = await prisma.location.findFirst({
      where: {
        medi: mediId,
        locationId: parseInt(locationId),
      },
    });

    if (location) {
      res.status(200).json(location);
    } else {
      res.status(404).json({ error: "Location not found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while retrieving location data" });
  }
});

// 서버 실행
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
