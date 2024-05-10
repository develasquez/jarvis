const {VertexAI} = require('@google-cloud/vertexai');
const vertex_ai = new VertexAI({project: 'gdg-genai-workshop', location: 'us-central1'});
const model = 'gemini-1.5-pro-preview-0409';
const prompt = require('./prompt');

const invoke = async (message) => {

    
    const generativeModel = vertex_ai.preview.getGenerativeModel({
      model: model,
      generationConfig: {
        'maxOutputTokens': 8192,
        'temperature': 1,
        'topP': 0.95,
      },
      safetySettings: [
        {
            'category': 'HARM_CATEGORY_HATE_SPEECH',
            'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
            'category': 'HARM_CATEGORY_DANGEROUS_CONTENT',
            'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
            'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
            'category': 'HARM_CATEGORY_HARASSMENT',
            'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ],
    });
   

    text = prompt.jarvis(message)
    
      const req = {
        contents: [
          {role: 'user', parts: [{text}]}
        ],
      };
    
      const response = await generativeModel.generateContent(req);
    
      
  return  response.response.candidates[0].content.parts[0].text
}


module.exports = { invoke }