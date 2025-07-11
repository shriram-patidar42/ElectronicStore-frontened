import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../services/product.service";
import { Button, Card, Col, Container, Form, FormGroup, Modal, Row, Table } from "react-bootstrap";
import { toast } from "react-toastify";

const ViewProducts = () => {
    const [products, setProducts] = useState([]);
    const [currentProduct, setCurrentProduct] = useState({
        title: '',
        description: '',
        price: 0,
        discountedPrice: 0,
        quantity: 1,
        live: false,
        stock: true
    });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = () => {
        getAllProducts(0, 1000, "addedDate", "desc")
            .then(data => {
                setProducts(data.content);
            })
            .catch(error => {
                console.log(error);
                toast.error("Failed to load products");
            });
    };

    const handleProductEdit = (product) => {
        setCurrentProduct(product);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setCurrentProduct({
            title: '',
            description: '',
            price: 0,
            discountedPrice: 0,
            quantity: 1,
            live: false,
            stock: true
        });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCurrentProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Container>
            <h3>All Products</h3>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Live</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={product.productId}>
                            <td>{index + 1}</td>
                            <td>
                                {/* <img
                                    src={product.productImageName ? `https://electronic-backend-production-28db.up.railway.app/products/image/${product.productId}` : "https://via.placeholder.com/80"}
                                    alt={product.title}
                                    style={{ width: '80px', height: '80px' }}
                                /> */}

                                <img
                                    src={`https://electronic-backend-production-28db.up.railway.app/products/image/${product.productId}`}
                                    alt={product.title}
                                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                    onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/80";
                                    }}
                                />
                                
                            </td>
                            <td>{product.title}</td>
                            <td>{product.description}</td>
                            <td>{product.price}</td>
                            <td>{product.quantity}</td>
                            <td>{product.live ? 'Yes' : 'No'}</td>
                            <td>{product.stock ? 'Yes' : 'No'}</td>
                            <td>
                                <Button variant="primary" size="sm" onClick={() => handleProductEdit(product)}>Edit</Button>{' '}
                                <Button variant="danger" size="sm">Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleModalClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        value={currentProduct.title}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="price"
                                        value={currentProduct.price}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row className="mt-3">
                            <Col>
                                <FormGroup>
                                    <Form.Label>Discounted Price</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="discountedPrice"
                                        value={currentProduct.discountedPrice}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Form.Label>Quantity</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="quantity"
                                        value={currentProduct.quantity}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>

                        <FormGroup className="mt-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={6}
                                placeholder="Enter here"
                                value={currentProduct.description}
                                onChange={(event) => setCurrentProduct({
                                    ...currentProduct,
                                    description: event.target.value
                                })}
                            />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>Close</Button>
                    <Button variant="primary">Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ViewProducts;
