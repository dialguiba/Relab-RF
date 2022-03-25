const express = require('express');
const router = express.Router();

const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');

router.get('/add',isLoggedIn, (req,res) => {
    res.render('links/add');
});

router.post('/add',isLoggedIn, async (req,res) => {
    const text = 'INSERT INTO links(title, url, description,user_id) VALUES($1,$2,$3,$4)';
    const { title, url, description } = req.body;
    const newLink = [
        title,
        url,
        description,
        req.user.id
    ];
    await pool.query(text, newLink);
    req.flash('success', 'Link saved succesfully');
    res.redirect('/links');
});

router.get('/',isLoggedIn, async (req,res) => {
    const links = (await pool.query('SELECT * FROM links WHERE user_id = $1', [req.user.id])).rows;        
    res.render('links/list', { links });
});

router.get('/delete/:id',isLoggedIn, async (req,res) => {
    const { id } = req.params;
    const deleteid = [id];
    const text = 'DELETE FROM links WHERE ID = $1';
    await pool.query(text, deleteid);
    req.flash('success', 'Links Removed successfully');
    res.redirect('/links');
});

router.get('/edit/:id',isLoggedIn, async (req,res) => {     
    const { id } = req.params;
    const editid = [id];
    const link = (await pool.query('SELECT * FROM links WHERE id = $1',editid)).rows;        
    res.render('links/edit', {link : link[0]});
});

router.post('/edit/:id',isLoggedIn, async (req,res) => {
    const { id } = req.params;
    const { title, description, url } = req.body;
    const newLinkEdit = [
        title, description, url, id
    ]
    const text = 'UPDATE links set title=$1, description=$2, url=$3 WHERE id = $4';
    await pool.query(text, newLinkEdit);
    req.flash('success', 'Link Updated Succesfully');    
    res.redirect('/links');
});

module.exports = router;