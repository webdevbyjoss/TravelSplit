
export function countAmountSpent(users) {
    let summ = 0;
    users.forEach((user)=>{
        summ += +user.amount;
    });
    return summ;
}

export function countTotalSpent(name, spendings) {
    let summ = 0;
    spendings.forEach((item)=>{
        return item.users.map((user)=>{
            if (user.name === name) {
                return summ += +user.amount
            }
        })
    });
    return summ;
};


export function countDebt(spendings, users, name) {
    let debt = 0;
    let totalSummSpent = 0;
    spendings.forEach((item)=>{
        return item.users.map((user)=>{
            return totalSummSpent += +user.amount
        })
    });
    let avarageSpent = totalSummSpent / users.length;

    debt = countTotalSpent(name, spendings) - avarageSpent;

    return debt;
}