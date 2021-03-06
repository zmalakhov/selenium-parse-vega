const {Builder, By, Key, util} = require('selenium-webdriver');

async function getDataFromUrl(nextUrl) {

    let needle = require('needle');
    let cheerio = require('cheerio');

    // let url = 'https://www.wildberries.ru/catalog/7539062/detail.aspx?targetUrl=ES';
    let url = nextUrl;


    let weight = '';

    needle.get(url, function (err, res) {
        if (err) throw (err);
        //console.log(res.body);

        let $ = cheerio.load(res.body);

        //console.log($(".brand").text())

        let params = $(".params .pp span");

        let ind = 0;

        params.each(function (i, val) {
            let txt = $(val).text().trim();
            if (txt === 'Вес товара без упаковки (г)'){
                //itm.weight = params[i+1];
                ind = i+1;
            }


            // console.log($(val).text()+'\n')
            // console.log(i)

        })

        params.each(function (i, val) {
            let txt = '';
            if (i === ind){
                txt = $(val).text().trim();
                // console.log(txt)
                weight = txt;
                //return weight;
            }


            // console.log($(val).text()+'\n')
            // console.log(txt)

        })



        // let brandName = $("#body-layout .card-row .first-horizontal .brand");
        // console.log('brandName: ' + $(brandName).text().trim());
        // let productName = $("#body-layout .card-row .first-horizontal .name");
        // console.log('productName: ' + $(productName).text().trim());
        //
        // let article = $("#body-layout .card-row .second-horizontal .article .j-article");
        // console.log('article: ' + $(article).text().trim());
        //
        // let rating = $("#body-layout .card-row .second-horizontal .product-rating span");
        // console.log('rating: ' + $(rating).text().trim());
        //
        // let comments = $("#body-layout .card-row .second-horizontal #comments_reviews_link span i");
        // console.log('comments: ' + $(comments).text().trim());
        //
        // // let orders = $("#body-layout .card-row .second-horizontal .order-quantity span.j-orders-count");
        // let orders = $("#body-layout .card-row .second-horizontal .j-orders-count-wrapper .j-orders-count");
        // console.log('orders: ' + $(orders).text().trim());


        //console.log(item);



    })

    //console.log(weight);

    /////////////////////////////////////////////////////////////////////////////////
    let  item = {};

    let driver = await new Builder().forBrowser('firefox').build();

    // await driver.get('http://google.com');
    // await driver.get('https://www.wildberries.ru/catalog/7539062/detail.aspx?targetUrl=ES');
    await driver.get(url);
    // await driver.findElement(By.name('q')).sendKeys('selenium', Key.RETURN);

    // driver.getCapabilities().then(function(caps) {
    //     console.log(caps);
    // });

    await sleep(2000);

    let firstHorizontal = await driver.findElement(By.xpath("//div[@id='body-layout']//div[@class='card-row']//div[@class='first-horizontal']"));
    let brand = await firstHorizontal.findElement(By.xpath("//span[@class='brand']"));
    let brandName = await brand.getText();
    let product = await firstHorizontal.findElement(By.xpath("//span[@class='name']"));
    let productName = await product.getText();

    let secondHorizontal = await driver.findElement(By.xpath("//div[@id='body-layout']//div[@class='card-row']//div[@class='second-horizontal']"));
    let articleElement = await secondHorizontal.findElement(By.xpath("//div[@class='article']//span[@class='j-article']"));
    let article = await articleElement.getText();
    let ratingElement = await secondHorizontal.findElement(By.xpath("//div[@class='product-rating']//span"));
    let rating = await ratingElement.getText();
    let commentLinkElement = await secondHorizontal.findElement(By.xpath("//a[@id='comments_reviews_link']//span/i"));
    let comment = await commentLinkElement.getText();


    let ordersElement = '';
    let orders = '0';

    try {
        ordersElement = await secondHorizontal.findElement(By.xpath("//p[@class='order-quantity j-orders-count-wrapper']//span"));
        orders = await ordersElement.getText();
    }catch (e) {
    }



    let cardRightHorizontal = await driver.findElement(By.xpath("//div[@id='body-layout']//div[@class='card-row']//div[@class='card-right']"));

    let finalCostElement;
    let priceNew = '0';
    try {
        finalCostElement = await cardRightHorizontal.findElement(By.xpath("//div[@class='cost']//span[@class='final-cost']"));
        priceNew = await finalCostElement.getText();
    }catch (e) {
    }

    let oldCostElement = '';
    let priceOld = '0';

    try {
        oldCostElement = await cardRightHorizontal.findElement(By.xpath("//del[@class='c-text-base']"));
        priceOld = await oldCostElement.getText();
    }catch (e) {
    }


    driver.quit();


    item.brandName = brandName;
    item.orders = orders;
    item.weight = weight;
    item.priceNew = priceNew;
    item.priceOld = priceOld;
    item.skidka = '';
    item.priceKg = '';
    item.dopInfo = '';
    item.rating = rating;
    item.comment = comment;
    item.orders1comment = '';
    item.typePakage = '';
    item.link = url;

    // item.productName = productName;
    // item.article = article;





    item.orders = strToNum(item.orders);
    item.priceNew = strToNum(item.priceNew);
    item.priceOld = strToNum(item.priceOld);
    item.weight = strToNum(item.weight);

    //console.log(item);

    return await item;

}

function sleep(ms) {
    ms += new Date().getTime();
    while (new Date() < ms){}
}

function strToNum(str) {
    let input = str;
    let output = "";
    for (let i = 0; i < input.length; i++){

        var outputSign = input[i];

        if (outputSign === "1"){
            output += 1;
        } else if (outputSign === "2"){
            output += 2;
        } else if (outputSign === "3"){
            output += 3;
        } else if (outputSign === "4"){
            output += 4;
        } else if (outputSign === "5"){
            output += 5;
        } else if (outputSign === "6"){
            output += 6;
        } else if (outputSign === "7"){
            output += 7;
        } else if (outputSign === "8"){
            output += 8;
        } else if (outputSign === "9"){
            output += 9;
        } else if (outputSign === "0"){
            output += 0;
        } else if (outputSign === "."){
            output += '.';
        } else if (outputSign === ","){
            output += ',';

        } else {
            output += '';
        }
    }

    return output;

}

//******************************************************************************
/*
* начало работы с программой
* */

const fs = require("fs");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// читаем линки по продуктам
let products = [];
// let jsonDataSemenaChia = require('./src/dataSemenaChia/LinksSemenaChia');
// products[0] = jsonDataSemenaChia;
// let jsonDataSpirulina = require('./src/dataSpirulina/LinksSpirulina');
// products[1] = jsonDataSpirulina;


products[0] = require('./src/dataBarleigras/LinksBarleigras');
products[1] = require('./src/dataGodji/LinksGodji');
products[2] = require('./src/dataGuarana/LinksGuarana');
products[3] = require('./src/dataHlorella/LinksHlorella');
products[4] = require('./src/dataKokosShugar/LinksKokosShugar');
products[5] = require('./src/dataMatcha/LinksMatcha');
products[6] = require('./src/dataSemenaChia/LinksSemenaChia');
products[7] = require('./src/dataSpirulina/LinksSpirulina');
products[8] = require('./src/dataVitgras/LinksVitgras');


(async () => {

    for (let p = 0; p < products.length; p++){
        console.log(products[p].name);
        let outputFile ='./src/data/' + products[p].name.trim() + '.csv';

        // готовим запись в CSV
        const csvWriter = createCsvWriter({
            // path: 'out.csv',
            path: outputFile,
            header: [
                {id: 'brandName', title: 'Бренд'},
                {id: 'orders', title: 'Кол-во продаж'},
                {id: 'weight', title: 'Вес товара'},
                {id: 'priceNew', title: 'Цена товара'},
                {id: 'priceOld', title: 'Цена до скидки'},
                {id: 'skidka', title: 'Скидка %'},
                {id: 'priceKg', title: 'Цена за кг.'},
                {id: 'dopInfo', title: 'Наличие доп. информации'},
                {id: 'rating', title: 'Оценка'},
                {id: 'comment', title: 'Кол-во отзывов'},
                {id: 'orders1comment', title: 'На какое кол-во продаж  1 отзыв'},
                {id: 'typePakage', title: 'Вид упаковки'},
                {id: 'link', title: 'Ссылка'},
            ],
            // fieldDelimiter: ';',
            // encoding: 'cp866'
        });

        let aUrls = products[p].links;
        let items = [];

        // console.log(products[p].name);
        for (let i = 0; i < aUrls.length; i++){
            // items[i] = getDataFromUrl(aUrls[i]);
            console.log(aUrls[i]);
            await getDataFromUrl(aUrls[i]).then((result) => {
                //console.log(result);
                items[i] = result;
            });
            // break;
        }

        csvWriter.writeRecords(items)
            .then(() => console.log('The CSV file was written successfully'));


        console.log(items);
    }



    // let aUrls = jsonDataSemenaChia.links;
    // let items = [];
    //
    // console.log(jsonDataSemenaChia.name);
    // for (let i = 0; i < aUrls.length; i++){
    //     // items[i] = getDataFromUrl(aUrls[i]);
    //     await getDataFromUrl(aUrls[i]).then((result) => {
    //         //console.log(result);
    //         items[i] = result;
    //     });
    // }
    //
    // console.log(items);

})();





