import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormGroup,
  InputGroup,
  Row,
} from "react-bootstrap";
import { toast } from "react-toastify";
import {
  addProductImage,
  createProductInCategory,
  createProductWithOutCategory,
} from "../../services/product.service";
import { getCategories } from "../../services/CategoryService";

const AddProduct = () => {
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: 0,
    discountedPrice: 0,
    quantity: 1,
    live: false,
    stock: true,
    image: undefined,
    imagePreview: undefined,
  });

  const [categories, setCategories] = useState(undefined);
  const [selectedCategoryId, setSelectedCategoryId] = useState("none");

  useEffect(() => {
    getCategories(0, 1000)
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error in loading categories");
      });
  }, []);

  const handleFileChange = (event) => {
    if (
      event.target.files[0].type === "image/png" ||
      event.target.files[0].type === "image/jpeg"
    ) {
      const reader = new FileReader();
      reader.onload = (r) => {
        setProduct({
          ...product,
          imagePreview: r.target.result,
          image: event.target.files[0],
        });
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      toast.error("Invalid file format (Only PNG/JPEG)");
      setProduct({
        ...product,
        image: undefined,
        imagePreview: undefined,
      });
    }
  };

  const clearForm = () => {
    setProduct({
      title: "",
      description: "",
      price: 0,
      discountedPrice: 0,
      quantity: 1,
      live: false,
      stock: true,
      image: undefined,
      imagePreview: undefined,
    });
  };

  const submitAddProductForm = (event) => {
    event.preventDefault();

    if (!product.title.trim()) {
      toast.error("Title is required !!");
      return;
    }

    if (!product.description.trim()) {
      toast.error("Description is required !!");
      return;
    }

    if (product.price <= 0) {
      toast.error("Invalid Price !!");
      return;
    }

    if (product.discountedPrice <= 0 || product.discountedPrice >= product.price) {
      toast.error("Invalid discounted price !!");
      return;
    }

    const create = selectedCategoryId === "none"
      ? createProductWithOutCategory(product)
      : createProductInCategory(product, selectedCategoryId);

    create
      .then((data) => {
        toast.success("Product is created !!");
        if (!product.image) {
          clearForm();
          return;
        }

        addProductImage(product.image, data.productId)
          .then(() => {
            toast.success("Image uploaded");
            clearForm();
          })
          .catch((error) => {
            console.log(error);
            toast.error("Error in uploading image");
          });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error in creating product !! check product details");
      });
  };

  return (
    <div>
      <Card className="shadow-sm">
        <Card.Body>
          <h5>Add Product here</h5>
          <Form onSubmit={submitAddProductForm}>
            <FormGroup className="mt-3">
              <Form.Label>Product title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter here"
                value={product.title}
                onChange={(e) =>
                  setProduct({ ...product, title: e.target.value })
                }
              />
            </FormGroup>

            <Form.Group className="mt-3">
              <Form.Label>Product Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                placeholder="Enter product description"
                value={product.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
              />
            </Form.Group>

            <Row>
              <Col>
                <FormGroup className="mt-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter here"
                    value={product.price}
                    onChange={(e) =>
                      setProduct({ ...product, price: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>

              <Col>
                <FormGroup className="mt-3">
                  <Form.Label>Discounted Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter here"
                    value={product.discountedPrice}
                    onChange={(e) => {
                      if (e.target.value > product.price) {
                        toast.error("Invalid Discount value !!");
                        return;
                      }
                      setProduct({
                        ...product,
                        discountedPrice: e.target.value,
                      });
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Form.Group className="mt-3">
              <Form.Label>Product Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter here"
                value={product.quantity}
                onChange={(e) =>
                  setProduct({ ...product, quantity: e.target.value })
                }
              />
            </Form.Group>

            <Row className="mt-3 px-1">
              <Col>
                <Form.Check
                  type="switch"
                  label="Live"
                  checked={product.live}
                  onChange={() =>
                    setProduct({ ...product, live: !product.live })
                  }
                />
              </Col>
              <Col>
                <Form.Check
                  type="switch"
                  label="Stock"
                  checked={product.stock}
                  onChange={() =>
                    setProduct({ ...product, stock: !product.stock })
                  }
                />
              </Col>
            </Row>

            <Form.Group className="mt-3">
              <Container
                hidden={!product.imagePreview}
                className="text-center py-4 border border-2"
              >
                <p className="text-muted">Image Preview</p>
                <img
                  className="img-fluid"
                  style={{ maxHeight: "250px" }}
                  src={product.imagePreview}
                  alt=""
                />
              </Container>
              <Form.Label>Select product image</Form.Label>
              <InputGroup>
                <Form.Control
                  type="file"
                  onChange={(e) => handleFileChange(e)}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() =>
                    setProduct({
                      ...product,
                      image: undefined,
                      imagePreview: undefined,
                    })
                  }
                >
                  Clear
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Select Category</Form.Label>
              <Form.Select
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                <option value="none">None</option>
                {categories &&
                  categories.content.map((cat) => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.title}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>

            <Container className="text-center mt-3">
              <Button type="submit" variant="success" size="sm">
                Add Product
              </Button>
              <Button
                onClick={clearForm}
                className="ms-1"
                variant="danger"
                size="sm"
              >
                Clear Data
              </Button>
            </Container>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddProduct;
