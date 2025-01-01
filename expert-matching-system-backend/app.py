from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import re
from werkzeug.utils import secure_filename
import fitz  # PyMuPDF
from langchain_ollama import ChatOllama
from wxflows_client import rag
from supabase import create_client, Client

app = Flask(__name__)
CORS(app)

# Configure upload folder and allowed extensions
UPLOAD_FOLDER = 'uploads'
RESULTS_FOLDER = 'results'
# MATCHING_FOLDER = 'matching'
ALLOWED_EXTENSIONS = {'pdf'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['RESULTS_FOLDER'] = RESULTS_FOLDER

# Configure LLM
llm = ChatOllama(
    model="llama3.1:8b",
    base_url="http://10.1.1.101:11434"
)

# Supabase credentials
url = "https://ccvunrogqlehekklflgf.supabase.co"  # Replace with your Supabase URL
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjdnVucm9ncWxlaGVra2xmbGdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcyNjA4ODcsImV4cCI6MjA0MjgzNjg4N30.GpUpsn2yYueFz7_9X8csteS7ug971Z0odYDbwgV2Q1M"  # Replace with your Supabase public API key
supabase: Client = create_client(url, key)


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


# Query for resumes
def get_resume_query(text):
    query = """
    You are an expert in extracting structured information from resumes.
    Your task is to extract specific fields from the given resume text.
    If a field is not present, return null for that field. The output should strictly be in JSON format without any additional explanations or text.

    The fields to extract are:
    - Name: Extract the full name of the candidate.
    - Education: Extract educational qualifications (degrees, institutions, dates).
    - Skills: Extract the technical and soft skills mentioned in the resume.
    - Experience: Extract professional experience details (titles, company, duration).
    - Total_Experience_in_Years: Calculate the total experience in years by summing the years mentioned in the experience section.
    - Location: Extract the location (city, state, country). If no location is found, return an empty string.
    - Certifications: Extract details about any certifications the candidate holds.
    - Summary: Provide a concise, one-line summary of the candidate’s professional profile.
    - employed_status: Keep it employed if there is 'present' mentioned in recent roles, else 'not employed'.

    - Contact_Info: Extract contact details of the candidate. This includes:
      - Email: Extract the candidate’s email address from the resume.
      - Phone: Extract the candidate’s phone number from the resume (if present).
      - LinkedIn: Extract the candidate’s LinkedIn profile URL (if mentioned).

    - Resume_Insights: Extract insights from the resume for the following attributes:
      - Certifications: List any certifications explicitly mentioned in the resume.

    The output should strictly follow this JSON structure:
    {{
        "resume_data": {{
            "Name": "",
            "Education": "",
            "Skills": "",
            "Experience": {{
                "title": "",
                "company": "",
                "duration": ""
            }},
            "Total_Experience": "In integer format",
            "Location": "",
            "summary": "summary the resume in sigle line",
            "employed_status": "",
            "contact_info": {{
                "email": "",
                "phone": "",
                "linkedin": ""
            }},
            "resume_insights": {{
                "Certifications": "extract it from provided resume_data"
            }}
        }}
    }}

    Here is the resume text:
    {}
    """.format(text)

    return query




# Query for job descriptions
def get_jd_query(text):
    query = f"""
    You are tasked with analyzing a job description and assigning weights (between 0 and 1) to various factors that determine the suitability of a candidate for this role.
    The weights should reflect the importance of each factor based on the job's specific requirements, industry standards, and the role's nature.


    In addition to weights, you must extract all key information from the job description that would be useful for matching with a resume. This data should be as accurate and comprehensive as possible, covering any important details that will help assess candidates. Pay special attention to skills, qualifications, experience, and specific requirements mentioned in the JD.


    Consider the following factors and adjust the weights accordingly:
   Responsibility: what are the  key responsibilities outlined in the job description, focusing on core tasks, leadership roles, and expected deliverables and assign the weight according to the priority. 
    - Skills: How important are the listed skills for the job?
    - Experience:Summarize candidate's work history, focusing on relevant roles, companies, and durations, and match to job experience requirements.
Experience: what type of experience is required , focusing on industrial roles  and assign it a weight according to its priority.
    - Qualifications: What educational or professional qualifications are required?
    - Keywords: Identify any keywords that are critical for this job.
  - culture fit : Identify company values, mission, and work environment preferences in the job description and assign weight based on their priority.


    **Additionally:**
    - **jd_data**: Extract all important details from the job description, including any mentioned job title, responsibilities, required skills, preferred qualifications, company or industry details, and any other relevant criteria that will be helpful for matching candidates to this job.


    Based on your analysis, assign a weight to each factor (between 0 and 1) to reflect its importance. Weights closer to 1 indicate higher importance.


    **Job Description:** {text}


    **Provide the response strictly in the following JSON format:**


    {{
        "job_description": {{
	        “responsibility”:””,
            "skills": "",
            "experience": "",
            "qualifications": ",
            "keywords": "",
	        “culture fit”:””,
            "jd_data": {{
                "job_title": "",
                "responsibilities": "",
                "required_skills": "",
	            “total_experience”:””,
                "preferred_qualifications": "",
                "company_details": "",
                "industry_details": "",
                "additional_criteria": ""
            }}
        }}
    }}
    """

    return query



# Function to process resume or job description text with LLM
def process_text_with_llm(query):
    try:
        a = rag.execute(
            endpoint="https://silanus.us-east-a.ibm.stepzen.net/wxflows-genai/watsonxdocs/graphql",
            apikey="silanus::local.net+1000::b81351a56de1b022db3108c47807bb668a659385119f32fa9e871a322a628fd6",
            name="myRag",
            vars={
                "n": 10,
                "question": query,
                "aiEngine": "WATSONX",
                "model": "meta-llama/llama-3-70b-instruct",
                "embedModel": "ibm/slate-30m-english-rtrvr-v2",
                "collection": "watsonxdocs",
                "parameters": {
                    "max_new_tokens": 1000,
                    "temperature": 0.7
                }
            },
            query="",
            max_depth=2
        )

        # Get the generated text from the response
        b = a['data']['myRag']['out']['modelResponse']['results'][0]['generated_text']
        print("Raw output from LLM:", b)  # Debug print

        # Use regex to extract JSON
        match = re.search(r'\{.*\}', b, re.DOTALL)
        if match:
            json_str = match.group(0)
            try:
                json_data = json.loads(json_str)
                return json_data
            except json.JSONDecodeError as e:
                print(f"JSON decode error: {str(e)}. Raw JSON string: {json_str}")
        else:
            print("No valid JSON found in the response.")
    except Exception as e:
        print(f"Unexpected error occurred: {str(e)}")


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
                    text = extract_text_from_pdf(filepath)

                    # Use the appropriate query function based on the category
                    if category.lower() == 'interviewers':
                        query = get_resume_query(text)
                    elif category.lower() == 'candidates':
                        query = get_jd_query(text)
                    else:
                        return jsonify({'error': 'Invalid category'}), 400

                    categorized_data = process_text_with_llm(query)

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


# Signup route
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password1 = data.get('password1')
    password2 = data.get('password2')

    # Basic validation
    if password1 != password2:
        return jsonify({'error': 'Passwords do not match!'}), 400

    # Check for existing user
    user_data = supabase.table('users').select('username').eq('username', username).execute()
    if user_data.data:
        return jsonify({'error': 'Username already exists!'}), 400

    # Store user data in Supabase
    supabase.table('users').insert({
        'username': username,
        'email': email,
        'password': password1  # Note: Passwords should be hashed in production
    }).execute()

    return jsonify({'message': 'Signup successful!'}), 201


# Login route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user_data = supabase.table('users').select('username', 'password').eq('username', username).execute()
    if user_data.data:
        if user_data.data[0]['password'] == password:  # Password should be hashed and compared in production
            return jsonify({'message': 'Login successful!'}), 200
        else:
            return jsonify({'error': 'Invalid password!'}), 400
    return jsonify({'error': 'User not found!'}), 404

# Health check route
@app.route('/health')
def health_check():
    return jsonify({'status': 'up'}), 200


#-----------------------------------------------
@app.route('/calculate-matching-scores', methods=['POST'])
def calculate_matching_scores():
    try:
        # Load the job description JSON dynamically from the 'candidates' folder
        candidates_folder = os.path.join(app.config['RESULTS_FOLDER'], 'candidates')
        jd_files = [f for f in os.listdir(candidates_folder) if f.endswith('.json')]
        
        if not jd_files:
            return jsonify({'error': 'No job description file found in candidates folder'}), 400

        # Load the first job description file (assuming there is only one)
        jd_path = os.path.join(candidates_folder, jd_files[0])
        with open(jd_path, 'r') as jd_file:
            jd_data = json.load(jd_file)
        
        # Directory containing resume JSON files
        resumes_folder = os.path.join(app.config['RESULTS_FOLDER'], 'interviewers')
        resume_files = [f for f in os.listdir(resumes_folder) if f.endswith('_result.json')]

        if not resume_files:
            return jsonify({'error': 'No resume files found in interviewers folder'}), 400

        # Create a folder named 'matching' inside the 'results' folder if it doesn't exist
        matching_folder = os.path.join(app.config['RESULTS_FOLDER'], 'matching')
        if not os.path.exists(matching_folder):
            os.makedirs(matching_folder)

        # Process each resume file
        for resume_file in resume_files:
            resume_path = os.path.join(resumes_folder, resume_file)
            
            # Load the resume JSON
            with open(resume_path, 'r') as resume_file_content:
                resume_data = json.load(resume_file_content)
            
            # Prepare the query for the LLM
            query = f"""
You are an expert AI system specialized in precise resume-to-job matching analysis. Your task is to analyze the provided resume data and job description data (both in JSON format) to generate a detailed matching analysis. Follow these strict guidelines:
Input Processing Rules:
Only use information explicitly present in the input JSONs
Do not hallucinate or infer details not present in the data
Maintain strict objectivity in scoring
Consider both exact matches and semantic equivalents for skills/requirements
Extract the weight of Scoring components (Skills Match, Experience Match, Education & Qualification Match, Responsibilities Match, Keyword Alignment, Cultural Fit) from the job description data.
Scoring Components:
Skills Match (Weight: “extract it from provided job description”)
Exact technical skill matches
Related/transferable skills
Tool/technology proficiency alignment
Experience Match (Weight: “extract it from provided job description”)
Years of experience alignment
Industry relevance
Role responsibility overlap
Education & Qualifications (Weight: “extract it from provided job description”)
Required qualification matches
Relevant certifications
Additional educational advantages
Responsibilities Match (Weight: "extract from provided job description")
Alignment: Match candidate responsibilities with the job description.
Core Tasks: Check for overlap with key tasks required.
Leadership/Ownership: Identify leadership or ownership roles.
Keyword Alignment (Weight: "extract from provided job description")
Relevance: Identify keywords in the resume that align with the job description or profile.
Semantic Match: Detect synonyms or related terms reflecting similar skills or concepts.
Relevance Frequency: Consider how often relevant terms appear, reflecting depth of expertise.

Cultural Fit (Weight: “extract it from provided job description”)
Company values alignment
Industry background match
Team structure compatibility
Scoring Formula:
Calculate individual component scores (0-100)
Apply weights to each component
Sum weighted scores for final match percentage
Keep it in decimal values
Matching Rules:
Skills:
Exact match: 100% of component weight
Related skill: 70% of component weight
Partial match: 40% of component weight
No match: 0%
Experience:
Exceeds requirement: 100%
Meets requirement: 90%
Within 1 year under: 70%
Within 2 years under: 50%
More than 2 years under: 30%
Output Format:
 The output should strictly follow this JSON structure:
{{
   "candidate_name": "",
   "matching_score": "",
   "skill_match": "",
   "experience_match": "",
   "culture_fit": "",
   "employed_status": "keep it employed if there is 'present' word mentioned in his recent roles else 'not employed'",
   "location": "",
   "total_experience": "",
   "skills": ["skill1","skill2","skill3","skill4"],
   "summary": "extract it from provided resume_data",
   "current_role": "",
   "recent_roles": [
     {{
       "title": "",
       "company": "",
       "duration": "extract it from provided resume_data"
     }},
     {{
       "title": "",
       "company": "",
       "duration": "extract it from provided resume_data"
     }},
     {{
       "title": "",
       "company": "",
       "duration": "extract it from provided resume_data"
     }}
   ],
   "contact_info": {{
     "email": "extract it from provided resume_data",
     "phone": "",
     "linkedin": ""
   }},
   "resume_insights": {{
     "Certifications": "extract it from provided resume_data"
   }}
}}

Here is the resume text:
    {resume_data}
Here is the job_description text:
   {jd_data}

"""
            
            # Call the LLM to process the query and handle the response
            try:
                a = rag.execute(
                    endpoint="https://silanus.us-east-a.ibm.stepzen.net/wxflows-genai/watsonxdocs/graphql",
                    apikey="silanus::local.net+1000::b81351a56de1b022db3108c47807bb668a659385119f32fa9e871a322a628fd6",
                    name="myRag",
                    vars={
                        "n": 10,
                        "question": query,
                        "aiEngine": "WATSONX",
                        "model": "meta-llama/llama-3-70b-instruct",
                        "embedModel": "ibm/slate-30m-english-rtrvr-v2",
                        "collection": "watsonxdocs",
                        "parameters": {
                            "max_new_tokens": 1000,
                            "temperature": 0.7
                        }
                    },
                    query="",
                    max_depth=2
                )

                # Get the generated text from the response
                b = a['data']['myRag']['out']['modelResponse']['results'][0]['generated_text']
                print("Raw output from LLM:", b)  # Debug print

                # Use regex to extract JSON from the raw response
                match = re.search(r'\{.*\}', b, re.DOTALL)
                if match:
                    json_str = match.group(0)
                    print(f"Extracted JSON string: {json_str}")  # Debug print

                    # Attempt to parse the JSON string
                    try:
                        json_data = json.loads(json_str)
                        print("Valid JSON extracted:", json_data)  # Debug print
                    except json.JSONDecodeError as e:
                        print(f"JSON decode error: {str(e)}. Raw JSON string: {json_str}")
                        continue  # Skip this resume if the JSON is invalid
                else:
                    print("No valid JSON found in the response.")
                    continue

            except Exception as e:
                print(f"Unexpected error occurred during LLM processing: {str(e)}")
                continue

            # Save the valid result in the 'matching' folder
            if json_data:
                result_filename = f"{os.path.splitext(resume_file)[0]}_matching_score.json"
                # result_path = os.path.join(matching_folder, result_filename)

                project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Get the parent directory of the 'backend' folder
                data_dir = os.path.join(project_dir, 'src', 'data')  # Update path to include 'src/data'


                # Define the path for the JSON file
                json_file_path = os.path.join(data_dir,result_filename)

                
                with open(json_file_path, 'w') as result_file:
                    json.dump(json_data, result_file, indent=4)
                print(f"Matching score for {resume_file} saved to {json_file_path}")

        return jsonify({'message': 'Matching scores calculated successfully.'}), 200

    except Exception as e:
        print(f"Error calculating matching scores: {str(e)}")
        return jsonify({'error': 'Error calculating matching scores'}), 500


if __name__ == "__main__":
    app.run(debug=True)


if __name__ == "__main__":
    app.run(debug=True)