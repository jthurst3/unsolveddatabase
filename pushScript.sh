#!/bin/bash
git add index.html
git commit -m $1
git push heroku master
