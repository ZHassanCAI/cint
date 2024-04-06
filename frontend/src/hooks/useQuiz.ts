import { useReducer } from "react";
import { QuizItem } from "@components/Quiz";
import { ActionType, QuizAction, StateType } from "./types";
import { adjustQuestionAnswers, calculateFinalScore, shuffleQuizQuestions } from "@utils/utils";

export const useQuiz = () => {
  const initialState: StateType = {
    currentQuestionIndex: -1,
    correctAnswers: 0,
    attemptedQuestion:0,
    finalScore: -1,
    questions: [],
  };  

  const quizReducer = (state: StateType, action: QuizAction)=>  {
    switch (action.type) {
      case ActionType.START_QUIZ: {
        return {
          ...initialState,
          currentQuestionIndex: 0,
          questions: shuffleQuizQuestions(
            adjustQuestionAnswers(action.payload.quiz)
          ),
        };
      }
      case ActionType.NEXT_QUESTION:{
        const correct_answer=state.questions[state.currentQuestionIndex].correct_answer.trim().toLowerCase();
        const user_answer=action.payload.userAnswer.trim().toLowerCase();       
        
      const updatedState={
          ...state,
          currentQuestionIndex: state.currentQuestionIndex + 1,
          attemptedQuestion:user_answer.trim().length>0?state.attemptedQuestion+1:state.attemptedQuestion,
          correctAnswers: correct_answer===user_answer
            ? state.correctAnswers + 1
            : state.correctAnswers,          
        };

        return {
          ...updatedState,
          finalScore: calculateFinalScore(updatedState),
        };        
      } 
      case ActionType.RESET_QUIZ: {
        return {
          ...initialState,
          currentQuestionIndex: 0,
          questions: shuffleQuizQuestions(state.questions),
        };
      }
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(quizReducer, initialState);

  const startQuiz = (quiz: QuizItem[]) => {
    dispatch({ type: ActionType.START_QUIZ, payload: { quiz } });
  };
  const restartQuiz = () => {
    dispatch({ type: ActionType.RESET_QUIZ });
  };
  const nextQuestion = (userAnswer: string) => {
    dispatch({ type: ActionType.NEXT_QUESTION, payload: { userAnswer } });
  };
  const getCurrentQuestion =()=> {
    return state.questions[state.currentQuestionIndex];
  };

  return {
    ...state,
    currentQuestion: getCurrentQuestion(),
    startQuiz,
    nextQuestion,
    restartQuiz,
  };
};