import * as React from "react";

const CertificateThumbnail = ({ certificate }) => {
  const { data: templateData } = certificate;
  const editorData = JSON.parse(templateData.editorData);
  const { fields } = editorData;

  return (
    <svg
      width="100%"
      viewBox="0 0 1280 908"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        backgroundImage: `url(${editorData.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      preserveAspectRatio="xMidYMin slice"
    >
      <ThumbnailTextField field={fields[0]}>{templateData.memberName}</ThumbnailTextField>

      {parseInt(templateData.typeCertificate) !== 1 && (
        <ThumbnailTextField field={fields[1]}>{templateData.peringkatName}</ThumbnailTextField>
      )}

      <ThumbnailTextField field={fields[2]}>{templateData.kategoriName}</ThumbnailTextField>
    </svg>
  );
};

const ThumbnailTextField = ({ children, field }) => {
  return (
    <text
      textAnchor="middle"
      dominantBaseline="hanging"
      x={field.x}
      y={field.y}
      fontSize={field.fontSize}
      fontFamily={field.fontFamily}
      fontWeight={field.fontWeight}
      fill={field.color}
    >
      {children}
    </text>
  );
};

export default CertificateThumbnail;
