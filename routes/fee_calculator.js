const express = require("express")
const router = express.Router()
const path = require("path")
const excel = require("excel4node")

const workbook = new excel.Workbook()
const sheet = workbook.addWorksheet("Fee Calculation")

var file_path

router.get("/", (req, res) =>{
    var applicant = {
        reference: String,
        rent: Number,
        start_date: Date,
        end_date: Date,
        isInstallments: String,
        type: String
    }
    res.render("fee_calculator/index", {applicant})

})

router.get("/api/download", async (req, res)=>{
    try {
        res.download(path.join(__dirname ,"../", file_path))
        console.log("File downloaded.")
        
    } catch{
        res.render("fee_calculator",{
            errorMessage: "There was an error downloading the file."
        })
    }
})

router.post("/", async (req, res)=>{
    const applicant = {
        reference: req.body.reference,
        rent: req.body.rent,
        start_date: new Date(req.body.start_date),
        end_date: new Date(req.body.end_date),
        isInstallments: req.body.isInstallments,
        type: req.body.type
    }
    
    const reference = applicant.reference
    const months = monthCalculation(applicant.start_date, applicant.end_date)
    const initialAmount = initialPayment(applicant.isInstallments)
    const rent = minimumLengthRent(months, applicant.rent)
    const discount = discountCalculation(applicant.type, rent)
    const feeAfterDiscount = minimumFee(rent, discount).feeAfterDiscount
    var fee = minimumFee(rent, discount).fee
    const amountIncreased = installmentsIncrease(applicant.isInstallments, fee).amountIncreased
    var fee = installmentsIncrease(applicant.isInstallments, fee).newFee
    const feeLeft = installmentsCalculation(applicant.isInstallments, fee, months, initialAmount).feeLeft
    const installmentAmount = installmentsCalculation(applicant.isInstallments, fee, months, initialAmount).installmentAmount


    sheet.cell(4, 2).string("Tenancy Start Date:")
    sheet.cell(5, 2).string("Tenancy End Date:")

    sheet.cell(8, 2).string("Customer Reference Number:")
    sheet.cell(9, 2).string("Total Rent Amount:")
    sheet.cell(10, 2).string("Upfront payment (max 12 months):")
    sheet.cell(11, 2).string("Fee after Installments Increase:")
    sheet.cell(12, 2).string("First Payment:")
    sheet.cell(13, 2).string("Fee to Be Split Monthly:")
    sheet.cell(14, 2).string("Subsequent (Monthly) Payments:")
    sheet.cell(15, 2).string("Number of Installments:")

    sheet.cell(4, 3).string(applicant.start_date.toISOString().split("T")[0])
    sheet.cell(5, 3).string(applicant.end_date.toISOString().split("T")[0])

    sheet.cell(8, 3).string(reference)
    sheet.cell(9, 3).number(Number(Number(rent).toFixed(2)))
    sheet.cell(10, 3).number(Number(feeAfterDiscount.toFixed(2)))
    sheet.cell(11, 3).number(Number(fee.toFixed(2)))
    sheet.cell(12, 3).number(Number(initialAmount.toFixed(2)))
    sheet.cell(13, 3).number(Number(feeLeft.toFixed(2)))
    sheet.cell(14, 3).number(Number(installmentAmount.toFixed(2)))
    sheet.cell(15, 3).number(months)

    file_path = `./static/excel/${reference}.xlsx`
    workbook.write(file_path)
    await new Promise(r => setTimeout(r, 125));
    res.redirect("fee_calculator/api/download")
})


// Calculating the difference of the months from the dates.
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

// Deciding if a initial payment is needed.
function initialPayment(isInstallments){
    if (isInstallments == 1){
        var initialAmount = 75
    }else{
        var initialAmount = 0
    }
    return initialAmount
}

// Calculating the rent if the tenancy is between 3 and 6 months.
function minimumLengthRent(months, rent){
    if (months >= 3 && months <=6){
        newRent = rent / 2
    }else if (months > 12 || months < 3 ){
        newRent = 0
    }else{
        newRent = rent
    }
    return newRent
}

// Calculating the discount on the rent if the applicant is a student.
function discountCalculation(type, rent){
    if (type == 1){
        discountAmount = rent * 0.20
    }
    return discountAmount
}

// Calculating the minimum fee for the applicant based on their rent and discount if applicable.
function minimumFee(rent, discount){
    if (rent - discountAmount < 295){
        fee = 295
    }else{
        fee = rent - discount
    }
    feeAfterDiscount = fee

    return {fee, feeAfterDiscount}
}


// Calculating the increase if the applicant will pay in installments.
function installmentsIncrease(isInstallments, fee){
    const INSTALLMENTS_RATE = 0.15
    if (isInstallments = 1){
        var newFee = fee + (fee * INSTALLMENTS_RATE)
        var amountIncreased = fee * INSTALLMENTS_RATE
    }else{
        var newFee = fee
    }
    return {newFee, amountIncreased}
}


// Calculating the installments
function installmentsCalculation(isInstallments, fee, months, initialPayment){
    if (isInstallments == 1){
        var feeLeft = fee - initialPayment
        var installmentAmount = feeLeft / months 
    }
    return {feeLeft, installmentAmount}
}

module.exports = router