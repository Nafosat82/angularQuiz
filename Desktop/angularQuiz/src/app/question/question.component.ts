import { Component, OnInit } from '@angular/core';
import { QuestionsService } from '../services/questions.service';
import { interval } from 'rxjs';
@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  public name: string = ""
  public questionList:any = []
  public currentQuestion:number = 0
  public points:number = 0
  counter = 60
  correctAnswer:number = 0
  incorrectAnswer:number = 0
  interval$:any;
  progress:string = "0"
  isQuizCompeted:Boolean = false

  constructor(private questionService: QuestionsService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem("name")!
    this.getAllQuestions()
    this.startCounter()
  }

  getAllQuestions(){
    this.questionService.getQuestionJson()
    .subscribe(res =>{
      this.questionList = res.question
    })
  }


  nextQuestion(){
    this.currentQuestion++
  
  }

  prevQuestion(){
    this.currentQuestion--
  }

  answer(currentQno:number ,option:any){
    if(currentQno === this.questionList.length){
      setTimeout(()=>{
        this.isQuizCompeted = true
      },1000); 
      this.stopCounter()
    }
    if(option.correct){
      this.points += 10
      this.correctAnswer++
      setTimeout(()=>{
        this.currentQuestion++
        this.resetCounter()
        this.getProgressPersent()
      },1000);
    }else{     
      this.incorrectAnswer++
      this.points -= 10
      setTimeout(()=>{
        this.currentQuestion++ 
        this.resetCounter()
        this.getProgressPersent()  
      },1000);
    }
  }

  startCounter(){
    this.interval$ = interval(1000)
    .subscribe(val=>{
      this.counter--
      if(this.counter == 0){
        this.counter = 60
        this.points -=10
        this.currentQuestion++
      }
    })
    setTimeout(()=>{
      this.interval$.unsubscribe()
    },600000);
  }

  stopCounter(){
      this.interval$.unsubscribe()
      this.counter = 0
  }

  resetCounter(){
    this.stopCounter()
    this.counter = 60
    this.startCounter()
  }

  resetGame(){
    this.resetCounter()
    this.getAllQuestions()
    this.points=0
    this.counter = 60
    this.progress = '0'
  }

  getProgressPersent(){
    this.progress = ((this.currentQuestion/this.questionList)*100).toString()
    return this.progress
  }
}
