CREATE DATABASE IF NOT EXISTS WISEST_ANNOTATE_DB;
USE WISEST_ANNOTATE_DB;

-- Table: accounts
CREATE TABLE IF NOT EXISTS accounts (
  id int NOT NULL AUTO_INCREMENT,
  email varchar(255) NOT NULL,
  password_hash varchar(255) NOT NULL,
  role enum('Admin','Validator','Annotator','Pending') DEFAULT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  name varchar(100) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY email (email),
  KEY name_index (name)
);

-- Table: analysis_questions
CREATE TABLE IF NOT EXISTS analysis_questions (
  question_id int NOT NULL AUTO_INCREMENT,
  form_label enum('AMSTAR2','ROBIS') NOT NULL,
  question_number text,
  question_text text,
  PRIMARY KEY (question_id)
);

-- Table: pdf_files
CREATE TABLE IF NOT EXISTS pdf_files (
  pdf_id int NOT NULL AUTO_INCREMENT,
  pdf_number int DEFAULT NULL,
  pdf_file_name varchar(255) DEFAULT NULL,
  pdf_title varchar(255) DEFAULT NULL,
  status enum('Revision Needed','Available','Being Validated','Completed','Being Worked On','Re-Annotation Requested') DEFAULT NULL,
  chat_history longtext,
  pdf_file longblob,
  annotated_by json DEFAULT NULL,
  validated_by json DEFAULT NULL,
  PRIMARY KEY (pdf_id),
  UNIQUE KEY id (pdf_id),
  KEY pdf_id (pdf_number),
  KEY pdf_title (pdf_title)
);

-- Table: analysis_answers
CREATE TABLE IF NOT EXISTS analysis_answers (
  answer_id int NOT NULL AUTO_INCREMENT,
  question_id int DEFAULT NULL,
  pdf_id int DEFAULT NULL,
  question_number text,
  robis_responses text,
  amstar_2_responses text,
  agreement_or_not text,
  clarity_of_evidence text,
  quote_from_sr text,
  rationale text,
  PRIMARY KEY (answer_id),
  KEY question_id (question_id),
  KEY pdf_id (pdf_id),
  CONSTRAINT fk_analysis_answers_question_id FOREIGN KEY (question_id) REFERENCES analysis_questions (question_id),
  CONSTRAINT fk_analysis_answers_pdf_id FOREIGN KEY (pdf_id) REFERENCES pdf_files (pdf_id)
);

ALTER TABLE analysis_questions MODIFY form_label VARCHAR(50);  -- Adjust the length as necessary

-- Insert AMSTAR2 questions into analysis_questions table with manually assigned IDs
INSERT INTO analysis_questions (question_id, form_label, question_number, question_text) VALUES
(1, 'AMSTAR', '1', 'Did the research questions and inclusion criteria for the review include the components of PICO?'),
(2, 'AMSTAR', '2', 'Did the report of the review contain an explicit statement that the review methods were established prior to the conduct of the review and did the report justify any significant deviations from the protocol?'),
(3, 'AMSTAR', '3', 'Did the review authors explain their selection of the study designs for inclusion in the review?'),
(4, 'AMSTAR', '4', 'Did the review authors use a comprehensive literature search strategy?'),
(5, 'AMSTAR', '5', 'Did the review authors perform study selection in duplicate?'),
(6, 'AMSTAR', '6', 'Did the review authors perform data extraction in duplicate?'),
(7, 'AMSTAR', '7', 'Did the review authors provide a list of excluded studies and justify the exclusions?'),
(8, 'AMSTAR', '8', 'Did the review authors describe the included studies in adequate detail?'),
(9, 'AMSTAR', '9', 'Did the review authors use a satisfactory technique for assessing the risk of bias (RoB) in individual studies that were included in the review?'),
(10, 'AMSTAR', '10', 'Did the review authors report on the sources of funding for the studies included in the review?'),
(11, 'AMSTAR', '11', 'If meta-analysis was performed did the review authors use appropriate methods for statistical combination of results?'),
(12, 'AMSTAR', '12', 'If meta-analysis was performed, did the review authors assess the potential impact of RoB in individual studies on the results of the meta-analysis?'),
(13, 'AMSTAR', '13', 'Did the review authors account for RoB in individual studies when interpreting/ discussing the results of the review?'),
(14, 'AMSTAR', '14', 'Did the review authors provide a satisfactory explanation for, and discussion of, any heterogeneity observed in the results of the review?'),
(15, 'AMSTAR', '15', 'If they performed quantitative synthesis did the review authors carry out an adequate investigation of publication bias (small study bias) and discuss its likely impact on the results of the review?'),
(16, 'AMSTAR', '16', 'Did the review authors report any potential sources of conflict of interest, including any funding they received for conducting the review?');

-- Insert ROBIS questions into analysis_questions table with manually assigned IDs
INSERT INTO analysis_questions (question_id, form_label, question_number, question_text) VALUES
(17, 'ROBIS', '1.1', 'Did the review adhere to pre-defined objectives and eligibility criteria?'),
(18, 'ROBIS', '1.2', 'Were the eligibility criteria appropriate for the review question?'),
(19, 'ROBIS', '1.3', 'Were eligibility criteria unambiguous?'),
(20, 'ROBIS', '1.4', 'Were all restrictions in eligibility criteria based on date, sample size, study quality, outcomes measured appropriate (i.e. certain study characteristics)? If yes, indicate which study characteristic was an inclusion/exclusion criteria'),
(21, 'ROBIS', '1.5', 'Were any restrictions in eligibility criteria based on publication status or format, language, availability of data appropriate (i.e. sources of information)?'),
(22, 'ROBIS', '1.6', 'Concerns regarding specification of eligibility criteria (low, high, unclear)'),
(23, 'ROBIS', '2.1', 'Did the search include an appropriate range of databases/electronic sources for published and unpublished reports?'),
(24, 'ROBIS', '2.2', 'Were methods additional to database searching used to identify relevant reports?'),
(25, 'ROBIS', '2.3', 'Were the terms and structure of the search strategy likely to retrieve as many eligible studies as possible?'),
(26, 'ROBIS', '2.4', 'Were search strategy restrictions based on date, publication format, or language appropriate?'),
(27, 'ROBIS', '2.5', 'Were efforts made to minimise error in selection of studies?'),
(28, 'ROBIS', '2.6', 'Concerns regarding methods used to identify and/or select studies (low, high, unclear)'),
(29, 'ROBIS', '3.1', 'Were efforts made to minimise error in data collection?'),
(30, 'ROBIS', '3.2', 'Were sufficient study characteristics considered for both review authors and readers to be able to interpret the results?'),
(31, 'ROBIS', '3.3', 'Were all relevant study results collected for use in the synthesis?'),
(32, 'ROBIS', '3.4', 'Was risk of bias (or methodological quality) formally assessed using appropriate criteria?'),
(33, 'ROBIS', '3.5', 'Were efforts made to minimise error in risk of bias assessment?'),
(34, 'ROBIS', '3.6', 'Concerns regarding methods used to collect data and appraise studies (low, high, unclear)'),
(35, 'ROBIS', '4.1', 'Did the synthesis include all studies that it should?'),
(36, 'ROBIS', '4.2', 'Were all pre-defined analyses reported or departures explained?'),
(37, 'ROBIS', '4.3', 'Was the synthesis appropriate given the nature and similarity in the research questions, study designs and outcomes across included studies?'),
(38, 'ROBIS', '4.4', 'Was between-study variation (heterogeneity) minimal or addressed in the synthesis?'),
(39, 'ROBIS', '4.5', 'Were the findings robust, e.g. as demonstrated through funnel plot or sensitivity analyses?'),
(40, 'ROBIS', '4.6', 'Were biases in primary studies minimal or addressed in the synthesis?'),
(41, 'ROBIS', 'A', 'Did the interpretation of findings address all of the concerns identified in Domains 1 to 4?'),
(42, 'ROBIS', 'B', 'Was the relevance of identified studies to the review''s research question appropriately considered?'),
(43, 'ROBIS', 'C', 'Did the reviewers avoid emphasizing results on the basis of their statistical significance?'),
(44, 'ROBIS', 'Overall Judgment', 'ROBIS Overall Judgment: (low, high, unclear)');