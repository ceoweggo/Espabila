from typing import Dict, List, Tuple, Any, Optional
import re
import json
import requests

try:
    from transformers import pipeline
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False

# Check if Ollama is available
try:
    import ollama
    OLLAMA_AVAILABLE = True
except ImportError:
    OLLAMA_AVAILABLE = False
    print("Ollama not available. Install with: pip install ollama")

class NLPProcessor:
    """
    Utility class for processing text using NLP techniques
    """
    
    def __init__(self):
        """
        Initialize NLP processor with available models
        """
        self.sentiment_analyzer = None
        self.summarizer = None
        self.keyword_extractor = None
        self.llm_model = "mistral" if OLLAMA_AVAILABLE else None
        
        # Load models lazily only when needed
        if TRANSFORMERS_AVAILABLE:
            try:
                # Initialize sentiment analysis pipeline - for lightweight processing
                self.sentiment_analyzer = pipeline(
                    "sentiment-analysis", 
                    model="distilbert-base-uncased-finetuned-sst-2-english",
                    return_all_scores=True
                )
            except Exception as e:
                print(f"Error loading sentiment analyzer: {e}")
    
    def validate_open_response(self, text: str) -> bool:
        """
        Validate if an open response is meaningful and not gibberish.
        
        Args:
            text: User's open text response
            
        Returns:
            Boolean indicating if the text is valid
        """
        if not text or len(text.strip()) < 3:
            return False
            
        # Check for repetitive characters (e.g., 'aaaaaa')
        if re.search(r'(.)\1{5,}', text):
            return False
            
        # Check for random keyboard mashing (high consonant to vowel ratio)
        cleaned_text = re.sub(r'[^a-zA-Z]', '', text.lower())
        if len(cleaned_text) > 0:
            vowels = sum(1 for c in cleaned_text if c in 'aeiou')
            consonants = len(cleaned_text) - vowels
            # If more than 80% consonants, likely gibberish
            if consonants / len(cleaned_text) > 0.8 and len(cleaned_text) > 5:
                return False
                
        # Check for very low word variety (e.g., "test test test test")
        words = text.lower().split()
        if len(words) >= 4:
            unique_words = len(set(words))
            if unique_words / len(words) < 0.3:  # Less than 30% unique words
                return False
                
        return True
    
    def process_open_response(self, text: str) -> Tuple[str, Dict[str, float]]:
        """
        Process an open-ended response with NLP techniques.
        
        Args:
            text: The input text from the user
            
        Returns:
            Tuple of (processed_text, metadata) where metadata contains additional
            information extracted from the text like sentiment scores
        """
        if not text or len(text.strip()) == 0:
            return "", {"sentiment": {"neutral": 1.0}}
        
        # Validate the text is meaningful
        if not self.validate_open_response(text):
            return "", {"error": "invalid_input", "sentiment": {"neutral": 0.5}}
        
        # Clean text
        processed_text = self._clean_text(text)
        
        # Initialize metadata
        metadata = {
            "sentiment": {"neutral": 0.5, "positive": 0.25, "negative": 0.25},
            "length": len(processed_text),
            "complexity": self._calculate_complexity(processed_text)
        }
        
        # Run sentiment analysis if available
        if self.sentiment_analyzer and TRANSFORMERS_AVAILABLE:
            try:
                sentiment_results = self.sentiment_analyzer(processed_text[:512])  # Limit text length
                
                # Convert to standardized format
                if isinstance(sentiment_results, list) and len(sentiment_results) > 0:
                    if isinstance(sentiment_results[0], dict) and "label" in sentiment_results[0]:
                        # Single label format
                        label = sentiment_results[0]["label"].lower()
                        score = sentiment_results[0]["score"]
                        
                        if "positive" in label:
                            metadata["sentiment"] = {"positive": score, "negative": 1.0 - score, "neutral": 0.0}
                        elif "negative" in label:
                            metadata["sentiment"] = {"negative": score, "positive": 1.0 - score, "neutral": 0.0}
                        else:
                            metadata["sentiment"] = {"neutral": score, "positive": (1.0 - score) / 2, "negative": (1.0 - score) / 2}
                    elif isinstance(sentiment_results[0], list) and len(sentiment_results[0]) > 0:
                        # Multiple scores format
                        metadata["sentiment"] = {}
                        for item in sentiment_results[0]:
                            label = item["label"].lower()
                            score = item["score"]
                            if "positive" in label:
                                metadata["sentiment"]["positive"] = score
                            elif "negative" in label:
                                metadata["sentiment"]["negative"] = score
                            elif "neutral" in label:
                                metadata["sentiment"]["neutral"] = score
            except Exception as e:
                print(f"Error during sentiment analysis: {e}")
        
        # Extract keywords
        metadata["keywords"] = self._extract_keywords(processed_text)
        
        # Process with LLM if available
        llm_analysis = self._analyze_with_llm(processed_text)
        if llm_analysis:
            metadata.update(llm_analysis)
        
        return processed_text, metadata
    
    def _analyze_with_llm(self, text: str) -> Dict[str, Any]:
        """
        Analyze text using an LLM to extract traits and personality indicators.
        
        Args:
            text: The text to analyze
            
        Returns:
            Dictionary with analysis results
        """
        if not text or not OLLAMA_AVAILABLE or not self.llm_model:
            return {}
            
        try:
            # Prompt for trait analysis
            prompt = f"""Analyze the following text and extract personality traits, interests, and potential MBTI indicators. 
            Return the result as a JSON object with these fields:
            - traits: List of personality traits identified (e.g., ["creative", "analytical", "empathetic"])
            - mbti_indicators: Dictionary of MBTI dimension scores from 0-10 (e.g., {{"E": 7, "I": 3, "S": 2, "N": 8, "T": 6, "F": 4, "J": 5, "P": 5}})
            - ikigai_areas: Dictionary of Ikigai area scores from 0-10 (e.g., {{"passion": 8, "mission": 6, "profession": 4, "vocation": 7}})
            
            Text to analyze: "{text}"
            
            JSON response:"""
            
            # Call the Ollama model
            response = ollama.generate(model=self.llm_model, prompt=prompt)
            
            # Extract JSON from response
            response_text = response.get('response', '')
            json_match = re.search(r'```json\s*(.*?)\s*```', response_text, re.DOTALL)
            if json_match:
                json_str = json_match.group(1)
            else:
                json_str = response_text
                
            # Try to clean the JSON string for parsing
            json_str = re.sub(r'^[^{]*', '', json_str)  # Remove text before first {
            json_str = re.sub(r'[^}]*$', '', json_str)  # Remove text after last }
            
            try:
                result = json.loads(json_str)
                # Convert to more standardized format
                analysis = {
                    "llm_traits": result.get("traits", []),
                    "llm_mbti": result.get("mbti_indicators", {}),
                    "llm_ikigai": result.get("ikigai_areas", {})
                }
                return analysis
            except json.JSONDecodeError:
                print(f"Could not parse JSON from LLM response: {json_str}")
                return {}
                
        except Exception as e:
            print(f"Error analyzing with LLM: {e}")
            return {}
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs
        text = re.sub(r'https?://\S+|www\.\S+', '', text)
        
        # Remove excess whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def _calculate_complexity(self, text: str) -> float:
        """Calculate text complexity based on length and vocabulary"""
        if not text:
            return 0.0
            
        words = text.split()
        if not words:
            return 0.0
            
        # Simple complexity measure based on average word length
        avg_word_length = sum(len(word) for word in words) / len(words)
        
        # Normalize to 0-1 range (typical avg word length is 4-6)
        complexity = min(1.0, max(0.0, (avg_word_length - 3) / 5))
        
        return complexity
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract important keywords from text"""
        # Simple keyword extraction based on word frequency
        words = text.split()
        
        # Remove common stopwords
        stopwords = {"a", "an", "the", "and", "or", "but", "is", "are", "was", "were", 
                    "be", "been", "being", "in", "on", "at", "to", "for", "with", 
                    "about", "by", "of", "that", "this", "these", "those", "it", "i", 
                    "you", "he", "she", "they", "we", "my", "your", "his", "her", 
                    "their", "our", "me", "him", "them", "us"}
        
        # Filter out stopwords and short words
        filtered_words = [word for word in words if word not in stopwords and len(word) > 3]
        
        # Count word frequencies
        word_counts = {}
        for word in filtered_words:
            word_counts[word] = word_counts.get(word, 0) + 1
        
        # Get top keywords
        sorted_words = sorted(word_counts.items(), key=lambda x: x[1], reverse=True)
        top_keywords = [word for word, count in sorted_words[:10]]
        
        return top_keywords

# Singleton instance to reuse
nlp_processor = NLPProcessor()

def process_text(text: str) -> Tuple[str, Dict[str, Any]]:
    """
    Process text using NLP techniques
    
    Args:
        text: The text to process
        
    Returns:
        Tuple of (processed_text, metadata)
    """
    return nlp_processor.process_open_response(text) 