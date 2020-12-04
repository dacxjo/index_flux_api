'use strict'
const puppeteer = require('puppeteer')
const shelljs = require('shelljs')
const moment = require('moment')
const SearchResult = use('App/Models/SearchResult')

let pageIndex = 1;
let result = {}

const searchTitle = (title, array) => new Promise((resolve, reject) => {
    if (array.includes(title)) {
        return resolve(true)
    } else {
        return resolve(false)
    }
});

class SearchController {


    async execute({ params, request, response }) {
        pageIndex = 1;
        result = {}
        let req = request.all()
        await this.startPuppeteer(req.pageAddress, req.searchTerm, req.titleToSearch)
        response.send(result)
    }

    async startPuppeteer(pageAddress, searchTerm, titleToSearch) {
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        const page = await browser.newPage()
        await page.goto(pageAddress);
        await page.type('input.gLFyf.gsfi', searchTerm);
        page.keyboard.press('Enter');
        await page.waitForSelector('div#resultStats');
        await this.doSearch(page, titleToSearch)
        await shelljs.exec('pkill chrome')
    }

    async doSearch(page, titleToSearch) {

        const linksTitles = await page.$$('h3.LC20lb');
        let formatedTitles = [];
        for (let i = 0; i < linksTitles.length; i++) {
            let text = await (await linksTitles[i].getProperty('textContent')).jsonValue();
            formatedTitles.push(text);
        }
        await console.log('Página ' + pageIndex);
        await console.log(formatedTitles);
        await console.log(titleToSearch)
        let includes = await searchTitle(titleToSearch, formatedTitles);

        if (!includes) {
            await console.log('Buscando ...')
            try {
                await page.$eval('a#pnnext.pn', link => link.click());
            } catch (e) {
                console.log(e)
            }
            await page.waitForSelector('div#resultStats');
            pageIndex++;
            await this.doSearch(page, titleToSearch)
        } else {
            let screenshotName = new moment().format('dd-MM-YYYY-hh:mm:ss');
            await page.screenshot({ path: 'public/results/' + screenshotName + '.png', fullPage: true });
            let position = formatedTitles.indexOf(titleToSearch) + 1;
            await console.log('Lo encontré en la página ' + pageIndex + ' en la posición ' + parseInt(position));
            result = {
                formatedTitles: formatedTitles,
                position: position,
                pageIndex: pageIndex,
                screenshotURL: 'results/' + screenshotName + '.png'
            }
            const sr = new SearchResult()
            sr.pageIndex = pageIndex
            sr.position = position
            sr.screenshotURL = 'results/' + screenshotName + '.png'
            await sr.save()
        }
    }


}

module.exports = SearchController
