import "./MiddleSection.css";

const DisplayImg = (p) => {
  return (
    <div
      className="DisplayImg"
      style={{
        backgroundPositionX: -p.leftPos,
        backgroundPositionY: -p.topPos,
        width: p.width,
        height: p.height,
        marginBottom: p.bottom,
      }}
    ></div>
  );
};

const imgCard = () => {
  return (
    <div className="imgCard">
      <div className="firstColumn">
        <DisplayImg leftPos="70" topPos="45" width="140px" height="100px" />
        <DisplayImg leftPos="10" topPos="149" width="200px" height="180px" />
        <DisplayImg leftPos="70" topPos="333" width="140px" height="120px" />
        <DisplayImg leftPos="70" topPos="457" width="140px" height="200px" />
      </div>
      <div className="secondColumn">
        <DisplayImg leftPos="214" topPos="-1" width="150px" height="265px" />
        <DisplayImg leftPos="214" topPos="268" width="150px" height="150px" />
        <DisplayImg leftPos="214" topPos="422" width="150px" height="235px" />
      </div>
      <div className="thirdColumn">
        <DisplayImg leftPos="368" topPos="65" width="100px" height="150px" />
        <DisplayImg leftPos="368" topPos="219" width="145px" height="150px" />
        <DisplayImg leftPos="368" topPos="373" width="165px" height="170px" />
        <DisplayImg
          leftPos="10px"
          topPos="540"
          width="80px"
          height="70px"
          bottom="40px"
        />
      </div>
    </div>
  );
};

export default imgCard;
