import styles from "../../styles/loading-dots.module.css";

const LoadingDots = ({
  color = "#000",
  style = "small",
  marginLeft = "0px"
}: {
  color: string;
  style: string;
  marginLeft: string;
}) => {
  return (
    <span className={style == "small" ? styles.loading2 : styles.loading} style={{marginLeft:marginLeft}}>
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
    </span>
  );
};

export default LoadingDots;

LoadingDots.defaultProps = {
  style: "small",
};
