import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useEffect, useRef, useState } from "react";

const FormPhoto = (props) => {
  const [enableButton, setEnableButton] = useState(true);
  const [formPhoto, setFormPhoto] = useState({
    title: "",
    description: "",
    photos: [],
  });
  const fileUploadRef = useRef();

  useEffect(() => {
    setFormPhoto({ ...props.formEdit[0] });
  }, [props.formEdit]);

  useEffect(() => {
    if (!formPhoto.title || !formPhoto.description) {
      setEnableButton(true);
    } else {
      setEnableButton(false);
    }
  }, [formPhoto]);

  const onTemplateSelect = (e) => {
    SetPhotoForm();
  };

  const chooseOptions = {
    icon: "pi pi-fw pi-images",
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };

  const blobToBase64 = (blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  };

  const loadFile = () => {
    if (!fileUploadRef.current.files) {
      return;
    }
    const arrFile = fileUploadRef.current.state.files.map((item) =>
      blobToBase64(item)
    );
    return Promise.all(arrFile);
  };

  const SetPhotoForm = async () => {
    const filePhoto = await loadFile();
    setFormPhoto({ ...formPhoto, photos: await filePhoto });
  };

  const AddPhoto = async (e) => {
    e.preventDefault();
    props.onSubmit(formPhoto);
  };

  const onUpload = (e) => {
    setFormPhoto({ ...formPhoto, photos: [] });
  };

  return (
    <div className="p-col">
      <form
        onSubmit={(e) => {
          AddPhoto(e);
        }}
      >
        <FileUpload
          ref={fileUploadRef}
          accept="image/*"
          maxFileSize={1000000}
          onSelect={onTemplateSelect}
          onClear={onUpload}
          mode="basic"
          chooseOptions={chooseOptions}
        />
        <div className="p-grid " style={{ marginTop: "20px" }}>
          <div className="p-col-12 p-col-align-center">
            <center>
              <img
                src={formPhoto.photos}
                style={{
                  height: "400px",
                  alignContent: "center",
                }}
              />
            </center>
          </div>

          <div className="p-col-12">
            <InputText
              value={formPhoto.title || ""}
              onChange={(e) => {
                setFormPhoto({ ...formPhoto, title: e.target.value });
              }}
              placeholder="Title"
              className="width-full-grid"
            />
          </div>
          <div className="p-col-12 width-full-grid">
            <InputTextarea
              placeholder="Description"
              value={formPhoto.description || ""}
              onChange={(e) => {
                setFormPhoto({ ...formPhoto, description: e.target.value });
              }}
              rows={4}
              className="width-full-grid"
            />
          </div>
          <div className="p-col-12">
            <Button
              disabled={enableButton}
              label="Save"
              className="width-full-grid"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormPhoto;
