export function validateMemoTitle(title:string){
    if(title.trim() === ""){
        return{
            code: "MEMO_NOT_TITLE",
            message: "タイトルを入力してください"
        }
    }
    if(title.length > 40){
        return{
            code: "MEMO_TITLE_40WORD_OVER",
            message: "タイトルは４０文字以内にしてください"
        }
    }
}

export function validateMemoText(memoText:string){
    if(memoText.trim() === ""){
        return{
            code: "MEMO_NOT_TEXT",
            message: "本文を入力してください"
        }
    }
    if(memoText.length > 250){
        return{
            code: "MEMO_TEXT_250WORD_OVER",
            message: "メモ本文は２５０文字以内にしてください"
        }
    }
}