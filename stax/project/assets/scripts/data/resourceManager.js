/*
Please Feel Free to remove this file if you dont need it
*/

var IMG_PATH_WIDTH_EXTENSION = '.w'
var IMG_PATH_HEIGHT_EXTENSION = '.h'
var IMG_PATH_PARTS_EXTENSION = '.parts'
var IMG_PATH_ROWS_EXTENSION = '.rows'
var IMG_PATH_COLS_EXTENSION = '.cols'

var IMG_PATH_ALPHA_EXTENSION = '.alpha'
var IMG_PATH_TRN_EXTENSION = '.trn'
var IMG_PATH_MSK_EXTENSION = '.msk'

var IMG_PATH_HOLD_TIME_EXTENSION = '.hold.time'
var IMG_PATH_LOCATION = '.location'
var IMG_PATH_RED_EXTENSION = '.r'
var IMG_PATH_GREEN_EXTENSION = '.g'
var IMG_PATH_BLUE_EXTENSION = '.b'

var _EXT = '.img'

cc.Class({
    name: 'ResourceManager',

    /**
     * init properties
     */
    ctor: function (gameCache = null , props = null) {
        this._cache = gameCache;
        this._props = props;

        this._spriteFrames = {};
        this._clips = {};
    },

    /**
     * @todo
     */
    array_init: function () {},

    /**
     * Clean all related items
     */
    onDestroy: function () {},

    /**
     * @return {number}
     */
    getNumRowsForSheet: function (path) {
        return this._props[path + IMG_PATH_ROWS_EXTENSION];
    },

    /**
     * @return {number}
     */
    getNumColsForSheet: function (path) {
        return this._props[path + IMG_PATH_COLS_EXTENSION];
    },

    /**
     * @return {number}
     */
    getNumPartsForStrip: function (path) {
        return this._props[path + IMG_PATH_PARTS_EXTENSION];
    },

    /**
     * @return {number}
     */
    getHoldTimeForImage: function (path) {
        return this._props[path + IMG_PATH_HOLD_TIME_EXTENSION];
    },

    /**
     * get Image Arrays From Sheet
     * @return {[cc.SpriteFrame]}
     */
    getImageArraysFromSheet: function (strImagePath) {
        var imgSheet = this.loadAlphaImageArray(strImagePath);

        var i = 0
        var x = 0
        var y = 0
        var iNumRows = this.getNumRowsForSheet(strImagePath);
        var iNumCols = this.getNumColsForSheet(strImagePath);
        var iTotalFrames = iNumRows * iNumCols;

        var aryImages = new Array(iTotalFrames);

        for (i = 0; i < iTotalFrames; i++) {
            // determine the row and column of the section to grab from the sheet
            x = i % iNumCols;
            y = i / iNumCols;
            aryImages[i] = this.getSubImageFromSheet(imgSheet, iNumCols, iNumRows,x, y);
        }

        return aryImages;
    },

    /**
     * To use this version, the .parts property must be in the def.properties file
     * @param {cc.Texture2D} strip
     * @param {string} ImagePath the path that was used to load the image, used to determine the number of parts
     * @return {[cc.SpriteFrame]}
     */
    getImageArraysFromStrip: function (strip, ImagePath) {
        var iNumParts = this._props[ImagePath + IMG_PATH_PARTS_EXTENSION];

        return this.getImageArraysFromStripNParts(strip, iNumParts);
    },

    /**
     * @param {cc.Texture2D} strip 
     * @param {number} iNumFrames
     * @return {[cc.SpriteFrame]}
     */
    getImageArraysFromStripNParts: function (strip, iNumFrames) {
        var i = 0
        var aryResult = new Array(iNumFrames);
        var iStripWidth = strip.width;
        var iPortionWidth = strip.width / iNumFrames;
        var iPortionHeight = strip.height;

        for (i = 0; i < iNumFrames; i++) {
            // constructor(filename?: string|Texture2D, rect?: Rect, rotated?: boolean, offset?: Vec2, originalSize?: Size)	

            // copy data using the fast pixel copying for Flash 10
            var src_rect = cc.rect(i * iPortionWidth, 0, iPortionWidth, iPortionHeight);

            var iatemp = new cc.SpriteFrame(strip, src_rect);

            aryResult[i] = iatemp;
        }

        return aryResult;
    },
    
    /**
     * return {[cc.SpriteFrame]}
     */
    getImagesFromStrip: function (pPalImgSource, iNumImages) {
        var paryResult = new Array(iNumImages);
        for ( var i = 0; i < iNumImages; i++) {
            paryResult[i] = this.getSubImageFromSheet(pPalImgSource, iNumImages, 1, i, 0);
        }

        return paryResult;
    },

    /**
     * Loads an ImageArray from a source
     * 
     * @param mod
     * @param imagePath
     * @return {cc.SpriteFrame}
     */
    loadAlphaImageArray_Services : function(imagePath){
        return this.loadAlphaImageArray(imagePath);
    },

    /**
     * @return {cc.Texture2D}
     */
    loadAlphaImageArray: function (imagePath) {
        var key = this._props[imagePath + _EXT];

        var imgArray = this._cache.getTexture2D(key);

        if(!imgArray){
            cc.warn("[ResourceManager][loadAlphaImageArray]:Failed to load image :" + imagePath + " key " + key);
        }

        return imgArray;
    },

    loadAlphaImageArrayColorOnly : function(iamgePath){
        return this.loadAlphaImageArray(imagePath);
    },

    loadTransGifImageArray : function(imagePath){
        return this.loadAlphaImageArray(imagePath);
    },

    loadNonAlphaImageArray : function (imagePath){
        return this.loadAlphaImageArray(imagePath);
    },

    loadNonAlphaImageArraysFromStrip : function(imagePath){
        return this.loadAlphaImageArraysFromStrip(imagePath);
    },

    loadAlphaImageArraysFromStrip : function(imagePath){
        var baseImage = this.loadAlphaImageArray(imagePath);

        var iNumParts  = this._props[imagePath + IMG_PATH_PARTS_EXTENSION];

        return this.getImageArraysFromStripNParts(baseImage, iNumParts);
    },

    /**
     * Loads an ImageArray from a source
     * 
     * @param mod
     * @param imagePath
     * @return {cc.SpriteFrame}
     */
    loadAlphaImageArray_Services : function(imagePath){
        return this.loadAlphaImageArray(imagePath);
    },

    /**
     * Loads 100% opaque (does not use alpha channel) image from the game's jar file.
     * The image's path must be decalered in the def.properties file, exclusive of the .trn or
     * .msk portions, which are added onto the passed path inside this method.
     * Also, the width and height of the image must also be declared. (.w and .h extensions)
     * 
     * @param spriteName the game given to the sprite when it is created
     * @param imagePath the path to the image in the jar, as defined in def.properties
     * @param bSetVisible whether to set the sprite visble upon creation
     * @param pLocation if not null, sets the layout location for placement on a Form object
     * @param {number} iX X location to set the sprite to upon creation
     * @param {number} iY Y location to set the sprite to upon creation
     * @param {number} iZ Z location to set the sprite to upon creation
     * @param {boolean} needScale
     * @return {cc.Sprite}
     */
    loadAlphaSprite : function( mod,
                                spriteName,
                                imagePath, 
                                bSetVisible,
                                bCenterHotspots,
                                pLocation,
                                iX,
                                iY,
                                iZ,
                                iBitDepth,
                                bFlushPogoImage,    
                                needScale = true)
    {
        var pNode = new cc.Node(spriteName);

        var imgArray = this.loadAlphaImageArray(imagePath);

        var pSprite = pNode.addComponent(cc.Sprite);

        if ( imgArray )
        {
            pSprite.spriteFrame = this.createSpriteFrame(imgArray);
            pNode.active = bSetVisible;

            if ( pLocation )
            {
                pNode.setPosotion(pLocation);
            }

            pNode.setPosition(iX, iY);
            pNode.zIndex = iZ;
        }

        return pSprite;
    },

    /** 
     * @return {cc.Sprite}
    */
    loadNonAlphaSprite : function(  mod,
                                    spriteName,
                                    imagePath, 
                                    bSetVisible,
                                    bCenterHotspots,
                                    pLocation,
                                    iX,
                                    iY,
                                    iZ,
                                    iBitDepth,
                                    bFlushPogoImage,
                                    needScale = true)
    {
        return this.loadAlphaSprite(mod, spriteName, imagePath, bSetVisible, bCenterHotspots, 
            pLocation, iX, iY, iZ, iBitDepth, bFlushPogoImage, needScale);
    },

    loadNonAlphaSprite_Services : function( mod,
                                            spriteName,
                                            imagePath,
                                            bSetVisible,
                                            bCenterHotspots,
                                            pLocation,
                                            iX,
                                            iY,
                                            iZ,
                                            iBitDepth,
                                            bFlushPogoImage,
                                            needScale = true)
    {
        return this.loadAlphaSprite(mod, spriteName, imagePath, bSetVisible, bCenterHotspots, 
            pLocation, iX, iY, iZ, iBitDepth, bFlushPogoImage, needScale);
    },

    /**
     * Creates and prepares a bitmapsprite with the supplied imagearray that was previously readied.
     * @param {cc.Texture2D} img
     * @param {cc.Node} childArea
     * @return {cc.Sprite}
    */
    prepareBitmapSprite : function (module,
                                    childArea,
                                    name,
                                    img,
                                    loc,
                                    bSetVisible,
                                    bCenterAnchor,
                                    iX,
                                    iY,
                                    iZ,
                                    needScale = true)
    {
        var newNode = new cc.Node(name);
        var newSprite = newNode.addComponent(cc.Sprite);

        newSprite.spriteFrame = this.createSpriteFrame(img);

        newNode.active = bSetVisible;

        if(loc){
            newNode.setPosotion(loc.x, loc.y);

            newNode.setLocalZOrder(loc.z);
        }

        if ( iX != -1) newNode.setPositionX( iX );
        if ( iY != -1) newNode.setPositionY( iY );
        if ( iZ != -1) newNode.setLocalZOrder( iZ );

        if(childArea){
            childArea.addChild(newNode);
        }

        return newNode;
    },

    prepareAnimSprite : function(   module,
                                    childArea,
                                    name,
                                    img,
                                    loc,
                                    bSetVisible,
                                    bCenterAnchor,
                                    iX,
                                    iY,
                                    iZ,
                                    needScale = true)
    {
        return this.prepareAnimSpriteAndStates( module, childArea, 1, name,
            img, loc, bSetVisible, bCenterAnchor,
            iX, iY, iZ ,needScale);
    },

    /**
     * @param {Vector3} pLocSetTo
     */
    prepareAnimSpriteUseLoc : function( module,
                                        childArea,
                                        name,
                                        img,
                                        loc,
                                        bSetVisible,
                                        bCenterAnchor,
                                        pLocSetTo)
    {
        if ( pLocSetTo )
        {
            return this.prepareAnimSpriteAndStates( module, childArea, 1, name,
                    img, loc, bSetVisible, bCenterAnchor,
                    pLocSetTo.x, pLocSetTo.y, pLocSetTo.z );
        }
        else
        {
            return this.prepareAnimSpriteAndStates( module, childArea, 1, name,
                    img, loc, bSetVisible, bCenterAnchor,
                    0, 0, 0);
        }
    },

    /**
     * @param {[cc.Texture2D]} imgs
     * @return {cc.Animation}
     */
    prepareAnimSpriteAndStates : function(  module,
                                            childArea,
                                            iNumStates,
                                            name,
                                            imgs,
                                            loc,
                                            bSetVisible,
                                            bCenterAnchor,
                                            iX,
                                            iY,
                                            iZ,
                                            needScale = true,
                                            frameRate = 12)
    {
        var pNode = new cc.Node(name);

        pNode.addComponent(cc.Sprite);

        var animation = pNode.addComponent(cc.Animation);

        animation.addClip(this.createClip(name, imgs, frameRate));

        animation.defaultClip = animation.getClips()[0];
        if(loc){
            pNode.setPosition(loc.x, loc.y);
            pNode.setLocalZOrder(loc.z);
        }else{
            if ( iX != -1) pNode.setPositionX( iX );
            if ( iY != -1) pNode.setPositionY( iY );
            if ( iZ != -1) pNode.setLocalZOrder( iZ );
        }

        if(childArea){
            childArea.addChild(pNode);
        }

        return animation;
    },

    /**
     * return {cc.Animation} return a Node with Animation Component but no clip attached on it
     */
    prepareAnimSpriteLite : function(   module,
                                        childArea,
                                        iNumStates,
                                        name,
                                        bSetVisible,
                                        bCenterAnchor,
                                        needScale = true)
    {
        var pNode = new cc.Node(name);

        pNode.addComponent(cc.Sprite);
        
        var animation = pNode.addComponent(cc.Animation);

        if(loc){
            pNode.setPosition(loc.x, loc.y);
            pNode.setLocalZOrder(loc.z);
        }else{
            if ( iX != -1) pNode.setPositionX( iX );
            if ( iY != -1) pNode.setPositionY( iY );
            if ( iZ != -1) pNode.setLocalZOrder( iZ );
        }

        if(childArea){
            childArea.addChild(pNode);
        }

        return animation; 
    },

    /**
     * Create Animation Clip from image array
     * @param {string} name
     * @param {Array} imgs
     * @param {number} sp
     * @return {cc.AnimationClip}
     */
    createClip : function (name, imgs, sp = 12){
        var clip = this._clips[name];

        if(clip){
            return clip;
        }else{
            clip = cc.AnimationClip.createWithSpriteFrames(imgs, sp);

            clip.name = name;

            this._clips[name] = imgs;

            return clip;
        }
    },

    /**
     * @param {cc.Texture2D} tex2d
     * @param {number} col
     * @param {number} row
     * @return string
     */
    _getSpriteFrameKey : function (tex2d, col, row) {
        return tex2d.url + '_' + col + '_' + row;
    },

    /**
     * @param {cc.Texture2D} srcImage
     * @param {number} iNumCols
     * @param {number} iNumRows
     * @param {number} iFromCol
     * @param {number} iFromRow
     */
    getSubImageFromSheet : function (srcImage, iNumCols, iNumRows, iFromCol, iFromRow) {
        var iSegmentWidth =  srcImage.width / iNumCols;
        var iSegmentHeight = srcImage.height / iNumRows;

        var key = this._getSpriteFrameKey(srcImage, iFromCol, iFromRow);

        var resultImage = this._spriteFrames[key];
        if(resultImage){
            return resultImage;
        }else{
            resultImage = this.createSpriteFrame(srcImage, cc.rect( iFromCol * iSegmentWidth,
                iFromRow * iSegmentHeight,
                iSegmentWidth,
                iSegmentHeight));

            this._spriteFrames[key] = resultImage;

            return resultImage;
        }
    },

    /**
     * cc.Texture2D
     * cc.Texture2D, rect
     * cc.Texture2D, rect data array
     * cc.Texture2D, x, y, w, h
     */
    createSpriteFrame: function () {
        var tx = arguments[0];
        var rc = null;
        switch (arguments.length) {
            case 1:
                rc = cc.rect(0, 0, tx.width, tx.height);
            break;
            case 2:
                if (arguments[1] instanceof cc.Rect) {
                    rc = arguments[1];
                }else if (arguments[1] instanceof Array) {
                    var value = arguments[1];
                    rc = cc.rect(value[0], value[1], value[2], value[3]);
                }
            break;
            case 5:
                rc = cc.rect(arguments[1], arguments[2], arguments[3], arguments[4]);
            break;
            default:
                cc.error('[resourceManager][createSpriteFrame]Wrong argument count');
            break;
        }

        cc.log(rc);

        return new cc.SpriteFrame(tx, rc, false, 0);
    },

    /**
     ==============================================================================
     */

    /**
     * Please Use Font of cocos instead.
     */
    getFontImageArraysFromStrip : function(){},
});
