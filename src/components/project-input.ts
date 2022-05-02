import Cmp from "./base-component.js";
import * as Validation from "../util/validation.js"
//名前の衝突を避ける際にasを使用する
import { autobind as Autobind } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";

// ProjectInput Class
export class ProjectInput extends Cmp<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  mandayInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input')
    

    // フォーム入力のinputエレメント
    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
    this.mandayInputElement = this.element.querySelector('#manday') as HTMLInputElement;
    
    this.configure();//プライベートだからクラスの内側でしかアクセスできない
  }

  public configure() {
    this.element.addEventListener('submit', this.submitHandler);//フォームがサブミットされた時にthis.submitHandlerが呼び出される 
  }

  renderContent(): void {
    
  }

  private gatherUserInput(): [string, string, number] | void {//ユーザーの入力値を取得してバリデーション
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredManday = this.mandayInputElement.value;

    const titleValidatable: Validation.Validatable = {
      value: enteredTitle,
      required: true,
    };
    const descriptionValidatable: Validation.Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    }
    const mandayValidatable: Validation.Validatable = {
      value: +enteredManday,
      required: true,
      min: 1,
      max: 1000
    }
    if (//各項目が空白で無い場合
      !Validation.validate(titleValidatable) ||
      !Validation.validate(descriptionValidatable) ||
      !Validation.validate(mandayValidatable)
    ) {
      alert('入力値が正しくありません。再度お試しください。')
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredManday];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.mandayInputElement.value = '';
  }

  @Autobind
  // レシーバ関数この中で入力項目にアクセスして検証する
  private submitHandler(event: Event) {
    event.preventDefault();//httpリクエストが送られないようにする
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {//配列？
      const [title, desc, manday] = userInput;
      projectState.addProject(title, desc, manday);
      this.clearInputs();
    }
  }
}