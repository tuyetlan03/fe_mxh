import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal"
import HeaderQA from "../header/HeaderQA";
import SidebarQA from "../sidebar/SidebarQA";
import { useNavigate } from "react-router-dom";
//import từ bên trong src
import style from "./Category.module.css";
import { apiUrl, ACCESS_TOKEN } from "../../../constants/constants";

const Category = () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN)
  const navigate = useNavigate()
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteCateModal, setShowDeleteCateModal] = useState(false)
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [addCategoryForm, setAddCategoryForm] = useState({
    Title: "",
    Description: "",
    DateInnitiated: new Date().toISOString(),
    Status: "Opening",
  });
  const [editingCategory, setEditingCategory] = useState({
    _id: "",
    editingTitle: "",
    editingDescription: "",
    editingDateInnitiated: null,
    editingStatus: "",
  });

  const { Title, Description, DateInnitiated, Status } = addCategoryForm;
  const {
    _id,
    editingTitle,
    editingDescription,
    editingDateInnitiated,
    editingStatus,
  } = editingCategory;

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`${apiUrl}/category/showAll`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        if (response.data.success) {
          console.log(response.data.categories);
          setCategories(response.data.categories);
          const convertDate = new Date(response.data.categories[0].DateInnitiated)
          response.data.categories[0].DateInnitiated = `${convertDate.getFullYear()}-${(
            convertDate.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${convertDate
              .getDate()
              .toString()
              .padStart(2, "0")}`
          setSelectedCategory(response.data.categories[0]);
          setEditingCategory(response.data.categories[0]);
        }
        console.log(selectedCategory)
      } catch (error) {
        console.error(error.response.data.message)
        if (error.response.status === 401) {
          navigate('/error')
        }
      }
    })();
  }, []);

  const onChangeAddCategoryForm = (event) =>
    setAddCategoryForm({
      ...addCategoryForm,
      [event.target.name]: event.target.value,
    });

  const onChangeEditCategoryForm = (event) =>
    setEditingCategory({
      ...editingCategory,
      [event.target.name]: event.target.value,
    });

  const addCategory = () => {
    setShowAddModal(false);
    (async () => {
      try {
        const response = await axios.post(
          `${apiUrl}/category/addCategory`,
          addCategoryForm, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
        );
        if (response.data.success) {
          console.log(response.data);
          response.data.category.Ideas = []
          const date = new Date(response.data.category.DateInnitiated);
          response.data.category.DateInnitiated = `${date.getFullYear()}-${(
            date.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
          setCategories([...categories, response.data.category]);
          setAddCategoryForm({
            Title: "",
            Description: "",
            DateInnitiated: new Date().toISOString(),
            Status: "Opening"
          });
        }
      } catch (error) {
        console.log(error.response.data)
        if (error.response.status === 401) {
          navigate('/error')
        }
      }
    })();
  };

  const getEditingCategory = () => {
    setShowEditModal(true);
    console.log(selectedCategory);
    setEditingCategory({
      _id: selectedCategory._id,
      editingTitle: selectedCategory.Title,
      editingDescription: selectedCategory.Description,
      editingDateInnitiated: selectedCategory.DateInnitiated,
      editingStatus: selectedCategory.Status,
    });
  };

  const editCategory = () => {
    setShowEditModal(false);
    (async () => {
      try {
        const response = await axios.put(
          `${apiUrl}/category/updateCategory/${editingCategory._id}`,
          {
            _id: _id,
            Title: editingTitle,
            Description: editingDescription,
            DateInnitiated: editingDateInnitiated,
            Status: editingStatus,
          }, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
        );
        if (response.data.success) {
          console.log(response.data);
          response.data.category.Ideas = selectedCategory.Ideas
          const convertDate = new Date(response.data.category.DateInnitiated)
          response.data.category.DateInnitiated = `${convertDate.getFullYear()}-${(
            convertDate.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${convertDate
              .getDate()
              .toString()
              .padStart(2, "0")}`
          setSelectedCategory(response.data.category);
          const newCategories = categories.map((category) => {
            if (category._id === response.data.category._id) {
              return response.data.category;
            }
            return category;
          });
          setCategories(newCategories);
        }
      } catch (error) {
        console.error(error.response.data)
        if (error.response.status === 401) {
          navigate('/error')
        }
      }
    })();
  };

  const deleteCategory = (event) => {
    event.preventDefault()
    setShowDeleteCateModal(false);
    (async () => {
      try {
        const response = await axios.delete(
          `${apiUrl}/category/deleteCategory/${selectedCategory._id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
        );
        if (response.data.success) {
          const filteredCategories = categories.filter(
            (category) => category._id !== selectedCategory._id
          );
          setCategories(filteredCategories);
          setSelectedCategory(filteredCategories[0]);
        }
      } catch (error) {
        console.error(error.response.data)
        if (error.response.status === 401) {
          navigate('/error')
        }
      }
    })();
  };

  return (
    <div className={style.categoryWrapper}>
      <SidebarQA />
      {/* ben duoi */}
      <div className={style.cateContainer}>
        <HeaderQA />
        <div className={style.cardCate}>
          <div className={style.CateLeft}>
            <div className={style.cardHeader}>
              <div className={style.cardSmall}>
                <div className={style.accountTableTilte}>{categories.length}  Category</div>
                <div className={style.iconCud}>
                  <div className={style.iconAdd}>
                    <i
                      className="fa fa-pencil"
                      aria-hidden="true"
                      onClick={getEditingCategory}
                    ></i>
                  </div>

                  <div className={style.iconAdd}>
                    <i
                      className="fa fa-trash-o"
                      aria-hidden="true"
                      onClick={() => setShowDeleteCateModal(true)}


                    ></i>
                  </div>

                  <div className={style.iconAdd}>
                    <i
                      className="fa fa-plus"
                      aria-hidden="true"
                      onClick={() => setShowAddModal(true)}
                    ></i>
                  </div>
                </div>
              </div>
            </div>

            <div className={style.tbCategory}>
              <div className={style.cardTb}>
                {selectedCategory && (
                  <table className="table table-hover">
                   
                    <tbody>
                      <tr> <br /> <br /> <br /> <br /> </tr>
                      <tr>
                        <th className={style.tiletb}>TITLE</th>
                        <td className={style.rowTb}>
                          {selectedCategory.Title}

                        </td>
                      </tr>
                      <tr>
                        <th className={style.tiletb}>DESCRIPTION</th>
                        <td>{selectedCategory.Description}</td>
                      </tr>
                      <tr>
                        <th className={style.tiletb}>INITIATED DATE</th>
                        <td>{selectedCategory.DateInnitiated}</td>
                      </tr>
                      <tr>
                        <th className={style.tiletb}>STATUS</th>
                        <td>{selectedCategory.Status}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          <div className={style.CateRight}>
            <div className={style.otherCategoriesWrapper}>
              <div className={style.labelList}>List of categories</div>
              <ul className={style.listcate}>
                {Array.isArray(categories) ? (
                  categories.map((category, index) => {
                    const date = new Date(category.DateInnitiated);
                    category.DateInnitiated = `${date.getFullYear()}-${(
                      date.getMonth() + 1
                    )
                      .toString()
                      .padStart(2, "0")}-${date
                        .getDate()
                        .toString()
                        .padStart(2, "0")}`;
                    return (
                      <li
                        key={index}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category.Title} (
                        {category.Ideas.length} ideas)
                      </li>
                    );
                  })
                ) : (
                  <h1>Error</h1>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className={style.categoryModal}>
          <div className={style.categoryModalContent}>
            <span
              className={style.categoryClose}
              onClick={() => setShowAddModal(false)}
            >
              &times;
            </span>
            <h1 className={style.cateTitle}>Add Category</h1>
            <form className={style.formAdd} onSubmit={addCategory}>
              <div className={style.inputCate}>
                <input
                  className={style.ipTitle}
                  type="text"
                  name="Title"
                  placeholder="Title"
                  required
                  value={Title}
                  onChange={onChangeAddCategoryForm}
                />
              </div>
              <div>
                <input
                  type="hidden"
                  name="DateInnitiated"
                  value={DateInnitiated}
                />
              </div>
              <div className={style.inputCate}>
                <select
                  className={style.ipStatus}
                  name="Status"
                  required
                  value={Status}
                  onChange={onChangeAddCategoryForm}
                >
                  <option value="Opening">Opening</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className={style.inputCate}>
                <textarea
                  rows={5}
                  className={style.ipDes}
                  type="text"
                  name="Description"
                  placeholder="Description"
                  required
                  value={Description}
                  onChange={onChangeAddCategoryForm}
                />
              </div>
              <input className={style.btnAddCate} type="submit" value="Add" />
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className={style.categoryModal}>
          <div className={style.categoryModalContent}>
            <span
              className={style.categoryClose}
              onClick={() => setShowEditModal(false)}
            >
              &times;
            </span>
            <h1 className={style.cateTitle}>Update Category</h1>
            <form className={style.formAdd} onSubmit={editCategory}>
              <input type="hidden" name="_id" value={_id} />

              <div className={style.inputCate}>
                <input
                  className={style.ipTitle}
                  type="text"
                  name="editingTitle"
                  placeholder="Title"
                  required
                  value={editingTitle}
                  onChange={onChangeEditCategoryForm}
                />
              </div>
              <div>
                <input
                  type="hidden"
                  name="editingDateInnitiated"
                  value={editingDateInnitiated}
                />
              </div>
              <div className={style.inputCate}>
                <select
                  className={style.ipStatus}
                  name="editingStatus"
                  required
                  value={editingStatus}
                  onChange={onChangeEditCategoryForm}
                >
                  <option value="Opening">Opening</option>
                  <option value="Closed">Closed</option>
                </select>

              </div>
              <div className={style.inputCate}>
                <textarea
                  rows={5}
                  className={style.ipDes}
                  type="text"
                  name="editingDescription"
                  placeholder="Description"
                  required
                  value={editingDescription}
                  onChange={onChangeEditCategoryForm}
                />
              </div>
              <input className={style.btnAddCate} type="submit" value="Save" />
            </form>
          </div>
        </div>
      )}

      <Modal className={style.addModal} isOpen={showDeleteCateModal} onRequestClose={() => setShowDeleteCateModal(false)}>
        <div className={style.modalAddEvent}>
          <form className={style.modalBodyAddEvent}>
            <div className={style.modalBodyAddEvent}>
              <div className={style.modalContentDeleteIdea}>
                <img src="https://cdn-icons-png.flaticon.com/128/9789/9789276.png" className={style.imgResponsive} alt="logo"/>
                {
                  selectedCategory && selectedCategory.Ideas.length === 0 ? <div> <h2 className={style.containerDelete}>Delete Category</h2>
                    <p className={style.contextDeleteIdea}>Are you sure you want to delete category? This action cannot be undone.</p>
                    <button className={style.btnAgree} onClick={deleteCategory} >Delete</button>
                    <button className={style.btnCancel} onClick={() => setShowDeleteCateModal(false)}>Cancel</button>
                  </div>
                  
                    : <div><h2 className={style.containerDelete}>Delete Category</h2>
                      <p className={style.contextDeleteIdea}>Can't delete this category because contains idea <br></br></p> <button className={style.btnCancel} onClick={() => setShowDeleteCateModal(false)}>Cancel</button></div>
                }
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Category;
