from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from werkzeug.utils import secure_filename
import fitz  # PyMuPDF
from langchain_ollama import ChatOllama
from langchain_core.messages import AIMessage

app = Flask(__name__)
CORS(app)

# Configure upload folder and allowed extensions
UPLOAD_FOLDER = 'uploads'
RESULTS_FOLDER = 'results'
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['RESULTS_FOLDER'] = RESULTS_FOLDER

# Configure LLM
llm = ChatOllama(
    model="llama3.1:8b",
    base_url="http://10.1.1.101:11434"
)

import json
from supabase import create_client, Client

# Supabase configuration
url: str = "https://ckzbqaeoutmrdtnnajir.supabase.co"
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNremJxYWVvdXRtcmR0bm5hamlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU4NjkzMzIsImV4cCI6MjA0MTQ0NTMzMn0.5asFiZDyQAsHxHvNB4mJbH-Y0lb9iM1MfJw5F5AO3iE"
supabase: Client = create_client(url, key)
table_name = "candidateprofile"


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Function to ensure a directory exists
def ensure_dir(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

# Function to extract text from a PDF file
def extract_text_from_pdf(pdf_path):
    text = ""
    pdf_document = fitz.open(pdf_path)
    for page_num in range(len(pdf_document)):
        page = pdf_document.load_page(page_num)
        text += page.get_text()
    return text

# Function to process resume text with LLM
def process_resume_with_llm(text):
    messages = [
        ("system", "Respond only with valid JSON. No additional explanations."),
        ("human", f"Categorize the following resume text into  fields(Personal Information, Education, Additional Qualifications, Skills,Projects, Experience,Achievements,Certifications). Output the categorization in pure JSON format, without any text before or after the JSON.Dont add new fields accept mentioned.: {text}")
    ]
    response = llm.invoke(messages)
   
    # Extract only the JSON content
    try:
        # Attempt to extract JSON from the response
        json_start = response.content.find('{')
        json_end = response.content.rfind('}') + 1
        json_data = json.loads(response.content[json_start:json_end])
    except json.JSONDecodeError:
        print(f"Failed to parse JSON for file. Full response: {response.content}")
        json_data = None
   
    return json_data

@app.route('/upload/<category>', methods=['POST'])
def upload_files(category):
    if 'file0' not in request.files:
        return jsonify({'error': 'No file part'}), 400
   
    # Ensure category folders exist
    upload_category_folder = os.path.join(UPLOAD_FOLDER, category)
    results_category_folder = os.path.join(RESULTS_FOLDER, category)
    ensure_dir(upload_category_folder)
    ensure_dir(results_category_folder)
   
    files = request.files.to_dict(flat=False)
   
    for key, file_list in files.items():
        for file in file_list:
            if file.filename == '':
                return jsonify({'error': 'No selected file'}), 400
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join(upload_category_folder, filename)
                file.save(filepath)
               
                if filename.endswith(".pdf"):
                    resume_text = extract_text_from_pdf(filepath)
                    categorized_data = process_resume_with_llm(resume_text)
                   
                    if categorized_data:
                        # Save results as JSON file in the category subfolder
                        result_filename = f"{os.path.splitext(filename)[0]}_result.json"
                        result_path = os.path.join(results_category_folder, result_filename)
                       
                        with open(result_path, 'w') as json_file:
                            json.dump(categorized_data, json_file, indent=4)
                       
                        print(f"Results for {filename} saved to {result_path}")


                    else:
                        print(f"Failed to process {filename}.")
   
    return jsonify({'message': f'Files uploaded and processed successfully for {category}'}), 200


@app.route('/submit-structured-jd', methods=['POST'])
def submit_structured_jd():
    data = request.json

    try:
        # Insert the data into the 'structured_jd' table
        result = supabase.table('structured_jd').insert(data).execute()
        
        # Check if the insertion was successful
        if len(result.data) > 0:
            return jsonify({"message": "Structured JD data saved successfully"}), 200
        else:
            return jsonify({"error": "Failed to save Structured JD data"}), 500

    except Exception as e:
        print(f"Error saving Structured JD data: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500



if __name__ == '__main__':
    app.run(debug=True)