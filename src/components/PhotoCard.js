import { Button } from "primereact/button";
import { Card } from "primereact/card";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";

const PhotoCard = (props) => {
  const photoContent = props.photo;
  const header = photoContent.photos && (
    <center>
      <LazyLoadImage
        alt="Card"
        loading="lazy"
        effect="opacity"
        delayTime={1000}
        onError={(e) =>
          (e.target.src =
            "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
        }
        style={{ height: "450px", minWidth: "300px" }}
        src={`${photoContent.photos[0]}`}
      />
    </center>
  );
  const footer = (
    <span>
      <Button
        label="Edit"
        icon="pi pi-pencil"
        onClick={() => {
          props.onEdit(photoContent.id);
        }}
        style={{ marginRight: ".25em" }}
      />
      <Button
        label="Delete"
        icon="pi pi-times"
        onClick={() => {
          props.onDelete(photoContent.id);
        }}
        className="p-button-secondary"
      />
    </span>
  );

  return (
    <>
      <Card footer={footer} header={header} className="card-photo p-shadow-3">
        <h1 style={{ fontFamily: "Mali", margin: "0px" }}>
          {photoContent.title}
        </h1>
        <br />
        {photoContent.description}
      </Card>
    </>
  );
};

export default PhotoCard;
