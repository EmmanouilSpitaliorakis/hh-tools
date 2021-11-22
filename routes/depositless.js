const express = require("express")
const router = express.Router()

const UPFRONT_COST = 25
const weeksInYear = 52
const monthsInYear = 12

function rentCalculation(rent, rentType){
    if (rentType === "1" ){
        rent = rent
    }
    else{
        rent = (rent * weeksInYear) / monthsInYear 
    }
    return rent
} 

function monthCalculation(start_date, end_date){
    const MILL_TO_DAYS = 1000 * 60 * 60 * 24
    const MONTH_DAY_AVRG = 30.3
    var timeDifference = end_date - start_date
    var dayDifference = (timeDifference / MILL_TO_DAYS)
    var monthDifference = Math.floor(dayDifference / MONTH_DAY_AVRG)
    
    if (monthDifference > 12 || monthDifference < 3){
        monthDifference = 0
    }
    return monthDifference
}

function installmentsCalculation(rent, duration){
    depositlessFee = rent / 5
    subscription_total = depositlessFee - UPFRONT_COST
    monthlyInstallment = subscription_total / duration

    return {depositlessFee, monthlyInstallment}
}


router.get("/", (req, res) =>{
    res.render("depositless", {
        islogged: true,
    })
})

router.post("/", (req, res) =>{
    const applicant = {
        reference: req.body.reference,
        email: req.body.email,
        rent: req.body.rent,
        rentType: req.body.rentType,
        start_date: new Date(req.body.start_date),
        end_date: new Date(req.body.end_date),
    }

    const reference = applicant.reference
    const email = applicant.email
    const start_date = applicant.start_date
    const end_date = applicant.end_date
    const rentType = applicant.rentType
    const rent = rentCalculation(applicant.rent, rentType)
    const duration = monthCalculation(start_date, end_date)
    const depositlessFee = installmentsCalculation(rent, duration).depositlessFee
    const installmentAmount = installmentsCalculation(rent, duration).monthlyInstallment


    res.render("depositless",{
        islogged: true,
        reference: reference,
        email: email,
        start_date: start_date,
        end_date: end_date,
        rent: rent,
        duration: duration,
        depositlessFee: depositlessFee,
        installmentAmount: installmentAmount
    })
})



module.exports = router