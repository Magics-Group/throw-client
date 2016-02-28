import {
    throttle
}
from 'lodash';
import {
    EventEmitter
}
from 'events';
import Promise from 'bluebird'

export default class Trakt extends EventEmitter {
    constructor(title) {
        super()

        this.parse(title)
    }



    parse(title) {
        var formatted = {};

        // regex match
        var se_re = title.match(/(.*)S(\d\d)E(\d\d)/i); // regex try (ex: title.s01e01)
        if (se_re !== null) {
            formatted.episode = se_re[3];
            formatted.season = se_re[2];
            formatted.title = se_re[1];
        } else {
            se_re = title.match(/(.*)(\d\d\d\d)+\W/i); // try another regex (ex: title.0101)
            if (se_re !== null) {
                formatted.episode = se_re[2].substr(2, 4);
                formatted.season = se_re[2].substr(0, 2);
                formatted.title = se_re[1];
            } else {
                se_re = title.match(/(.*)(\d\d\d)+\W/i); // try yet another (ex: title.101)
                if (se_re !== null) {
                    formatted.episode = se_re[2].substr(1, 2);
                    formatted.season = se_re[2].substr(0, 1);
                    formatted.title = se_re[1];
                } else {
                    se_re = title.replace(/\[|\]|\(|\)/, '').match(/.*?0*(\d+)?[xE]0*(\d+)/i); // try a last one (ex: 101, or 1x01)
                    if (se_re !== null) {
                        formatted.episode = se_re[2];
                        formatted.season = se_re[1];
                        formatted.title = se_re[0].replace(/0*(\d+)?[xE]0*(\d+)/i, '');
                    } else {
                        // nothing worked :(
                    }
                }
            }
        }

        // format
        formatted.title = formatted.title || title.replace(/\..+$/, ''); // remove extension;
        formatted.title = formatted.title.replace(/[\.]/g, ' ').trim()
            .replace(/^\[.*\]/, '') // starts with brackets
            .replace(/[^\w ]+/g, '') // remove brackets
            .replace(/ +/g, '-') // has multiple spaces
            .replace(/_/g, '-') // has '_'
            .replace(/\-$/, '') // ends with '-'
            .replace(/\s.$/, '') // ends with ' '
            .replace(/^\./, '') // starts with '.'
            .replace(/^\-/, ''); // starts with '-'

        // just in case
        if (!formatted.title || formatted.title.length === 0) {
            formatted.title = title;
        }


        console.log(formatted)


    }

}