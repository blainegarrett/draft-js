/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule EditorBidiService
 * @typechecks
 * @flow
 */

'use strict';

import type ContentState from 'ContentState';

var Immutable = require('immutable');
var UnicodeBidiService = require('UnicodeBidiService');

var nullthrows = require('nullthrows');

var {OrderedMap} = Immutable;

var bidiService;

var EditorBidiService = {
  getDirectionMap: function(
    content: ContentState,
    prevBidiMap: ?OrderedMap<any, any>,
  ): OrderedMap<any, any> {
    if (!bidiService) {
      bidiService = new UnicodeBidiService();
    } else {
      bidiService.reset();
    }

    var blockMap = content.getBlockMap();
    var nextBidi = blockMap
      .valueSeq()
      .map(block => nullthrows(bidiService).getDirection(block.getText()));
    var bidiMap = OrderedMap(blockMap.keySeq().zip(nextBidi));

    if (prevBidiMap != null && Immutable.is(prevBidiMap, bidiMap)) {
      return prevBidiMap;
    }

    return bidiMap;
  },
};

module.exports = EditorBidiService;
