const { Telegraf, Markup } = require('telegraf')
const my_const = require('./const')

require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => ctx.reply(`Привет ${ctx.message.from.first_name ? ctx.message.from.first_name : 'незнакомец'}!`))

bot.help((ctx) => ctx.reply(my_const.commands))

bot.command('course', async (ctx) => {
    try {
        await ctx.replyWithHTML('<b>Курсы</b>', Markup.inlineKeyboard(
            [
                [Markup.button.callback('Редакторы', 'btn_1'), Markup.button.callback('Обзоры', 'btn_2'), Markup.button.callback('JS', 'btn_3')]
            ]
        ))
    } catch (e) {
        console.error(e)
    }
})

// Функция для отправки сообщения ботом
// id_btn Идентификатор кнопки для обработки
// src_img Путь к изображению, или false чтобы отправить только текст
// text Текстовое сообщение для отправки
// preview Блокировать превью у ссылок или нет, true - блокировать, false - нет

function addActionBot(id_btn, src_img, text, preview) {
    bot.action(id_btn, async (ctx) => {
        try {
            await ctx.answerCbQuery()
            if (src_img !== false) {
                await ctx.replyWithPhoto({
                    source: src_img
                })
            }
            await ctx.replyWithHTML(text, {
                disable_web_page_preview: preview
            })
        } catch (e) {
            console.error(e)
        }
    })
}

addActionBot('btn_1', './img/1.jpg', my_const.text1, true)
addActionBot('btn_2', './img/2.jpg', my_const.text2, true)
addActionBot('btn_3', false, my_const.text3, false)

bot.launch()

// Включить плавную остановку
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))