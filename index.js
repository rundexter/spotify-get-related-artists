var _ = require('lodash'),
    util = require('./util.js'),
    SpotifyWebApi = require('spotify-web-api-node');

var pickInputs = {
        'id': { key: 'id', validate: { req: true } }
    },
    pickOutputs = {
        'name': { key: 'body.artists', fields: ['name'] },
        'popularity': { key: 'body.artists', fields: ['popularity'] },
        'external_urls': { key: 'body.artists', fields: ['external_urls.spotify'] },
        'followers': { key: 'body.artists', fields: ['followers'] },
        'uri': { key: 'body.artists', fields: ['uri'] }
    };

module.exports = {
    /**
     * The main entry point for the Dexter module.
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var spotifyApi = new SpotifyWebApi(),
            token = dexter.provider('spotify').credentials('access_token'),
            inputs = util.pickInputs(step, pickInputs),
            validateErrors = util.checkValidateErrors(inputs, pickInputs);

        if (validateErrors)
            return this.fail(validateErrors);

        spotifyApi.setAccessToken(token);
        spotifyApi.getArtistRelatedArtists(inputs.id)
            .then(function(data) {

                this.complete(util.pickOutputs(data, pickOutputs));
            }.bind(this), function(err) {
                this.fail(errc);
            }.bind(this));
    }
};
