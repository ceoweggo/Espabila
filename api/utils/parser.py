from typing import Dict, Any, List
from models.test import TestResponse

def parse_responses(answers_json: Dict[str, Any], test_blocks: List[Dict[str, Any]]) -> List[TestResponse]:
    """
    Parse JSON response data into structured TestResponse objects.
    
    Args:
        answers_json: Dictionary of question_id -> answer value from session
        test_blocks: List of question blocks from test definition
        
    Returns:
        List of TestResponse objects
    """
    responses = []
    
    # Create question lookup map
    questions_map = {}
    for block in test_blocks:
        print("Entra un block: ", block)
        for question in block.get('questions', []):
            questions_map[question.get('id')] = question
    
    # Process each answer
    for question_id, answer_value in answers_json.items():
        question = questions_map.get(question_id)
        if not question:
            continue
        print("Questio en el items: ", question)
        question_type = question.get('type')
        processed_answer = answer_value
        
        # Process based on question type
        if question_type == 'multiple-choice' and isinstance(answer_value, str):
            print("Entra en question multiple-choice")
            # Map text response to index
            processed_answer = map_option_text_to_indices(question, [answer_value])[0] if map_option_text_to_indices(question, [answer_value]) else 0
            
        elif question_type == 'multiple-select' and isinstance(answer_value, list):
            print("Entra en question multiple-select")
            # Map text responses to indices
            processed_answer = map_option_text_to_indices(question, answer_value)
            
        elif question_type == 'scale':
            print("Entra en question scale")
            # Convert to standardized format
            processed_answer = convert_scale_response(answer_value)
            
        responses.append(TestResponse(
            question_id=question_id,
            response=processed_answer
        ))
    
    return responses

def map_option_text_to_indices(question, options_text):
    """
    Map text option responses to their respective indices.
    
    Args:
        question: Question dictionary with options
        options_text: List of selected option texts
        
    Returns:
        List of option indices
    """
    indices = []
    
    # Determine if we should use optionsEs or options based on what's available
    options_list = question.get('optionsEs', []) or question.get('options', [])
    
    for text in options_text:
        for i, option_text in enumerate(options_list):
            # Handle both string options and dictionary options
            if isinstance(option_text, dict):
                option_text_value = option_text.get('text_es', '') or option_text.get('text', '')
            else:
                option_text_value = option_text
                
            if text == option_text_value:
                indices.append(i)
                break
                
    return indices

def convert_scale_response(response):
    """
    Convert scale response to a standardized format.
    
    Args:
        response: Response value which could be dict or list
        
    Returns:
        List of integer values
    """
    if isinstance(response, dict):
        # Convert dict to list, handling potential string keys
        max_key = max(int(k) if isinstance(k, str) and k.isdigit() else k for k in response.keys())
        return [response.get(str(i), 3) for i in range(max_key + 1)]
    elif isinstance(response, list):
        return response
    else:
        return []