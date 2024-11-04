import express from 'express';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import register from './Routes/Accounts/register.js';
import login from './Routes/Accounts/login.js';
import getAllUsers from './Routes/Accounts/get-all-users.js';
import getUser from './Routes/Accounts/get-user.js';
import updateUser from './Routes/Accounts/update-user.js';
import deleteUser from './Routes/Accounts/delete-user.js';
import uploadPdf from './Routes/PDFs/upload-pdf.js';
import retrievePdfFile from './Routes/PDFs/retrieve-pdf-file.js';
import getAllPdfDetails from './Routes/PDFs/get-all-pdf-details.js';
import retrievePdfDetails from './Routes/PDFs/retrieve-pdf-details.js';
import updatePdfDetails from './Routes/PDFs/update-pdf-details.js';
import saveQuestions from './Routes/Questions/save-questions.js'
import submitForValidation from './Routes/Questions/submit-for-validation.js';
import deletePdf from './Routes/PDFs/delete-pdf.js';
import requestForReannotation from './Routes/Questions/request-for-reannotation.js';
import retrieveSpecificPdfAnswers from './Routes/Questions/retrieve-specific-pdf-answers.js';
import requestToRevise from './Routes/Questions/request-to-revise.js';
import grantPermissionToReEdit from './Routes/Questions/grant-permission-to-re-edit.js';
import rejectRevisionRequest from './Routes/Questions/reject-revision-request.js';
import updateValidatorStatus from './Routes/Questions/update-validator-status.js';
import requestReset from './Routes/Accounts/request-reset.js';
import resetPassword from './Routes/Accounts/reset-password.js';
import executeSql from './Routes/SQL/execute-sql.js';
import { generateToken, verifyToken } from './utils/jwt.js';



dotenv.config();

let db = null;

async function connectDB() {
  try {
    //dev
    // db = knex({
    //   client: 'mysql2',
    //   connection: {
    //     host: process.env.MYSQL_HOST || 'localhost',
    //     user: process.env.MYSQL_USER || 'root',
    //     password: process.env.MYSQL_PASSWORD || 'Pmosthelegend37',
    //     database: process.env.MYSQL_DB || 'wisest_annotate_db',
    //     port: process.env.MYSQL_PORT || '3306',
    //   },
    // });

    //live
    db = knex({
      client: 'mysql2',
      connection: {
        host: 'database',
        user: 'root',
        password: 'Aeskcam123@45',
        database: 'WISEST_ANNOTATE_DB',
        port: '3306',
      },
    });
  } catch (error) {
    console.error("Database connection error:", error);
    console.log("Retrying in 5 seconds...");
    await new Promise(resolve => setTimeout(resolve, 5000));
    await connectDB(); // Recursive call to retry connection
  }
}

// Initial database connection attempt
connectDB();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());


app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3015'
}));


//To check if user is authenticated
function requireAuth(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = verifyToken(token.split(' ')[1]);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// });

/***************************** Account Related Routes ************************************************/

// Route for user register
app.post('/register', async (req, res) => register.handleRegister(req, res, db, bcrypt, generateToken));

// Route for user login
app.post('/login', async (req, res) => login.handleLogin(req, res, db, bcrypt, generateToken));

// Route to get all users' details
app.get('/get-all-users', requireAuth, async (req, res) => getAllUsers.handleGetAllUsers(req, res, db))

// Route to get only a specific user's details
app.get('/get-user/:id', requireAuth, async (req, res) => getUser.handleGetUser(req, res, db));

// Route to update a user
app.put('/update-user/:id', requireAuth, async (req, res) => updateUser.handleUpdateUser(req, res, db));

// Route to logout
app.post('/logout', (req, res) => res.json({ message: 'Logout successful' }));

// Route to request password reset
app.post('/request-reset', async (req, res) => requestReset.handleRequestReset(req, res, db));

// Route to reset password
app.post('/reset-password', async (req, res) => resetPassword.handleResetPassword(req, res, db));

// Route to delete a user
app.delete('/delete-user/:id', requireAuth, async (req, res) => deleteUser.handleDeleteUser(req, res, db));

// Route to authenticate user
app.get('/authenticate-user', requireAuth, (req, res) => res.json(req.user));
/*****************************************************************************************************/




/***************************** PDF/Paper Related Routes **********************************************/

const upload = multer({ dest: 'uploads/' });

// Route to upload pdf files
app.post('/upload-pdf', requireAuth, upload.array('pdf', 10), async (req, res) => uploadPdf.handleUploadPdf(req, res, db, fs));

// Route to retrieve a PDF file from the database. This is the actual PDF file, not its details such as annotated_by, validated_by and etc
app.get('/retrieve-pdf-file/:pdf_id', requireAuth, async (req, res) => retrievePdfFile.handleRetrievePdfFile(req, res, db));

// Route to retrieve all pdfs' details except the actual pdf files themselves
app.get('/get-all-pdf-details', requireAuth, async (req, res) => getAllPdfDetails.handleGetAllPdfDetails(req, res, db));

// Route to retrieve the details of a specific pdf only
app.get('/retrieve-pdf-details/:pdf_id', requireAuth, async (req, res) => retrievePdfDetails.handleRetrievePdfDetails(req, res, db))

// Route to update pdf details
app.put('/update-pdf-details', requireAuth, async (req, res) => updatePdfDetails.handleUpdatePdfDetails(req, res, db));

//Route to delete a pdf
app.delete('/delete-pdf/:pdf_id', requireAuth, async (req, res) => deletePdf.handleDeletePdf(req, res, db));

/*****************************************************************************************************/




/************************** Questions & Answers Related Routes ***************************************/

//Route to save questions and responses
app.post('/save-questions', async (req, res) => saveQuestions.handleSaveQuestions(req, res, db));

//Route to submit paper for validation
app.post('/submit-for-validation', requireAuth, async (req, res) => submitForValidation.handleSubmitForValidation(req, res, db));

//Route to request for re-annotation (change status back to "Being Validated")
app.post('/request-for-reannotation', requireAuth, async (req, res) => requestForReannotation.handleRequestForReAnnotation(req, res, db));

//Route to retrieve answers based on pdf_id
app.get('/retrieve-specific-pdf-answers/:pdf_id', requireAuth, async (req, res) => retrieveSpecificPdfAnswers.handleRetrieveSpecificPdfAnswers(req, res, db))

//Update Reannotation Status after rejecting the annotator's request to re-edit the paper
app.put('/reject-revision-request/:pdf_id', requireAuth, async (req, res) => rejectRevisionRequest.handleRejectRevisionRequest(req, res, db))

//Request the annotator to revise the paper they submitted
app.put('/request-to-revise', requireAuth, async (req, res) => requestToRevise.handleRequestToRevise(req, res, db))

//Route to grant permission to an annotator to re-edit a paper that was already completed
app.put('/grant-permission-to-reEdit', requireAuth, async (req, res) => grantPermissionToReEdit.handlePermissionToReEditPaper(req, res, db))

//Route to add validator's in the pdf column 'validated_by' when they validate
app.put('/update-validator-status', requireAuth, async (req, res) => updateValidatorStatus.handleUpdateValidatorStatus(req, res, db))
/*****************************************************************************************************/

//sql
app.post('/execute-sql', requireAuth, async(req, res) => executeSql.handleExecuteSql(req, res, db));

const port = process.env.PORT || 3016;
app.get('/', (req, res) => res.send(`<h1>Wisest Annotation Tool Backend Server is running on port ${port}</h1>`));
app.listen(port, () => console.log(`Wisest Annotation Tool Backend Server is running on port ${port}`));
