import React, { useState, useEffect } from 'react';
import { Typography, Button, Container, Box, Card, CardContent, CardMedia, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useSelector } from 'react-redux';

const OrderConfirmationPage = () => {
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);
    const { userName } = useSelector((state) => state.auth);

    const handleBackToDashboard = () => {
        navigate('/user/dashboard');
    };

    const generatePDF = async () => {
        try {
            const doc = new jsPDF();
            
            // Add order details
            doc.setFontSize(20);
            doc.text('Order Confirmation', 105, 20, { align: 'center' });
            
            doc.setFontSize(12);
            doc.text(`Customer: ${userName}`, 15, 40);
            doc.text(`Order Date: ${new Date().toLocaleDateString()}`, 15, 50);

            // Add a line separator
            doc.setLineWidth(0.5);
            doc.line(15, 60, 195, 60);

            // Add order items table
            doc.setFontSize(12);
            doc.text('Order Items:', 15, 70);

            let yPos = 80;
            if (orderDetails && orderDetails.items) {
                orderDetails.items.forEach((item, index) => {
                    doc.text(`${index + 1}. ${item.name}`, 15, yPos);
                    doc.text(`Price: $${item.price}`, 100, yPos);
                    yPos += 10;
                });
            }

            // Add total amount
            if (orderDetails && orderDetails.total) {
                doc.setFontSize(14);
                doc.text(`Total Amount: $${orderDetails.total}`, 15, yPos + 10);
            }

            // Add thank you message
            doc.setFontSize(12);
            doc.text('Thank you for your order!', 15, yPos + 30);
            doc.text('We will notify you when your order is ready for delivery.', 15, yPos + 40);

            // Save the PDF
            doc.save('order_confirmation.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    const createTransaction = async (transactionData) => {
        try {
            const response = await fetch(`https://smooth-comfort-405104.uc.r.appspot.com/document/createorupdate/transactions`, {
                method: 'POST',
                headers: {
                    'Authorization': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5Yjk2Y2FhNWVjNzQ5NDQxMThiNyIsInVzZXJuYW1lIjoibW9oYW1tZWQuZ0Bub3J0aGVhc3Rlcm4uZWR1IiwiaWF0IjoxNzI5NjY1OTQ4LCJleHAiOjE3MzE4MjU5NDh9.zt_Nr2QKj06ocTkCO_fpXrtspfjIbDLJI_MTzT9zWgQ`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData),
            });

            if (!response.ok) {
                throw new Error('Failed to create transaction');
            }
            return await response.json();
        } catch (error) {
            console.error("Error creating transaction:", error);
            throw error;
        }
    };


    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Card sx={{ 
                boxShadow: 4,
                p: 4,
                borderRadius: 2,
                textAlign: 'center',
                maxWidth: 500,
                mx: 'auto'
            }}>
                <Box sx={{ mb: 4 }}>
                    <CheckCircleIcon sx={{ fontSize: 100, color: 'success.main' }} />
                </Box>
                
                <Typography 
                    variant="h3" 
                    component="h1" 
                    gutterBottom 
                    sx={{ 
                        fontWeight: 'bold',
                        color: 'primary.main',
                        mb: 2
                    }}
                >
                    Thank You!
                </Typography>

                <Typography 
                    variant="h5" 
                    sx={{ 
                        fontWeight: 'medium',
                        mb: 4,
                        color: 'text.secondary'
                    }}
                >
                    Your order has been placed successfully
                </Typography>

                <Typography 
                    variant="body1" 
                    sx={{ mb: 4, color: 'text.secondary' }}
                >
                    We will send you an update once your order is ready for delivery.
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleBackToDashboard}
                    sx={{
                        px: 4,
                        py: 1.5,
                        fontWeight: 'bold',
                        borderRadius: 2,
                        '&:hover': {
                            backgroundColor: 'primary.dark'
                        }
                    }}
                >
                    Continue Shopping
                </Button>

                <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={generatePDF}
                    sx={{
                        px: 4,
                        py: 1.5,
                        fontWeight: 'bold',
                        borderRadius: 2,
                        ml: 2,
                        '&:hover': {
                            backgroundColor: 'primary.light'
                        }
                    }}
                >
                    Download Order PDF
                </Button>
            </Card>
        </Container>
    );
};

export default OrderConfirmationPage;
