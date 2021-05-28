import React, { useEffect, useState, useRef } from "react";
import http from "../services/http-common";
import PhotoCard from "./PhotoCard";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import FormPhoto from "./FormPhoto";
import Loader from "react-loader-spinner";
import { confirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";
import { debounce } from "lodash";

const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [mode, setMode] = useState("Add");
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [formPhoto, setFormPhoto] = useState({
    title: "",
    description: "",
    photos: [],
  });

  useEffect(() => {
    GetPhotos();
  }, []);

  const GetPhotos = async () => {
    try {
      const request = await http.get("/photos");
      const response = await request;
      if (response.status === 200) {
        console.log(response.data);
        setPhotos(response.data);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  //แสดงแจ้งเตือน
  const showAlert = (message, status, detail) => {
    toast.current.show({
      severity: status,
      summary: message,
      detail: detail,
      life: 3000,
    });
  };

  // Add, edit ข้อมูล ด้วย mode
  const SubmitPhoto = async (form) => {
    setLoading(true);
    switch (mode) {
      case "Add":
        AddPhoto(form);
        break;
      case "Edit":
        EditPhoto(form);
        break;
      default:
        break;
    }
    setFormPhoto({});
    setLoading(false);
  };

  //เพิ่ม
  const AddPhoto = async (form) => {
    try {
      const request = await http.post(`/photos`, form);
      const response = await request;
      if (response.status === 201) {
        setIsShowDialog(false);
        showAlert("Success", "success", "Insert Complete");
        GetPhotos();
      }
    } catch (error) {
      showAlert("Error", "error", error.message);
    }
  };

  //แก้ไข
  const EditPhoto = async (form) => {
    console.log("fsd");
    try {
      const request = await http.put(`/photos/${form.id}`, form);
      const response = await request;
      if (response.status === 200) {
        setIsShowDialog(false);
        showAlert("Success", "success", "Edit Complete");

        GetPhotos();
      }
    } catch (error) {
      showAlert("Error", "error", error.message);
    }
  };

  // patch ข้อมูล เพื่อ Edit
  const EditPhotoClick = async (id) => {
    setLoading(true);
    try {
      const request = await http.get(`/photos/${id}`);
      const response = await request;
      if (response.status === 200) {
        setFormPhoto(response.data);
        setMode("Edit");
        setIsShowDialog(true);
      }
    } catch (error) {
      showAlert("Error", "error", error.message);
    }
    setLoading(false);
  };

  // ลบข้อมูล
  const DeletePhoto = async (id) => {
    setLoading(true);
    try {
      const request = await http.delete(`/photos/${id}`);
      const response = await request;
      if (response.status === 200) {
        showAlert("Success", "success", "Delete Complete");
        GetPhotos();
      }
    } catch (error) {
      showAlert("Error", "error", error.message);
    }
    setLoading(false);
  };

  // Search
  const SearchPhoto = debounce(async (e) => {
    try {
      console.log("daas");
      const request = await http.get(`/photos?searchText=${e.target.value}`);
      const response = await request;
      if (response.status === 200) {
        setPhotos(response.data);
      }
    } catch (error) {
      showAlert("Error", "error", error.message);
    }
    setLoading(false);
  }, 400);

  // คอนเฟิมว่าจะลบนะ
  const confirmDelete = (id) => {
    confirmDialog({
      message: "Are you sure you want to proceed?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        DeletePhoto(id);
      },
    });
  };

  const listPhoto =
    photos &&
    photos.map((photoItems) => {
      return (
        <div key={photoItems.id} className="p-col-12 p-md-6 p-lg-4">
          <PhotoCard
            onDelete={confirmDelete}
            onEdit={EditPhotoClick}
            photo={photoItems}
          />
        </div>
      );
    });

  const dialog = (
    <Dialog
      header={`${mode} Photo`}
      visible={isShowDialog}
      blockScroll={true}
      style={{ width: 1000 }}
      onHide={() => {
        setFormPhoto({});
        setIsShowDialog(false);
      }}
    >
      <div className="p-grid">
        <FormPhoto onSubmit={SubmitPhoto} formEdit={formPhoto} />
      </div>
    </Dialog>
  );

  return (
    <div className="p-grid" style={{ marginTop: "200px" }}>
      <InputText
        placeholder="Search"
        className="width-full-grid"
        onChange={(e) => SearchPhoto(e)}
      />
      {listPhoto}
      {dialog}

      <Toast ref={toast} position="bottom-right" />

      <Button
        label="Add"
        icon="pi pi-plus"
        className="btn-add-photo"
        onClick={() => {
          setIsShowDialog(true);
          setMode("Add");
        }}
      />
      <Loader
        type="Puff"
        className="spinner"
        color="#00BFFF"
        height={100}
        width={100}
        visible={loading}
      />
    </div>
  );
};

export default Photos;
