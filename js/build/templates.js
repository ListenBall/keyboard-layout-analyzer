angular.module('kla').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('partials/about.htm',
    "<div>\r" +
    "\n" +
    "    <div class=\"jumbotron subhead\">\r" +
    "\n" +
    "        <h1>About</h1>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <p>\r" +
    "\n" +
    "        This application allows you to analyze and visualize the typing patterns you create when you use different keyboard layouts, such as the\r" +
    "\n" +
    "        <a href=\"https://en.wikipedia.org/wiki/QWERTY\">QWERTY</a>, <a href=\"http://www.theworldofstuff.com/dvorak/\">Dvorak</a>, and\r" +
    "\n" +
    "        <a href=\"http://colemak.com/\">Colemak</a> layouts.\r" +
    "\n" +
    "    </p>\r" +
    "\n" +
    "    <hr/>\r" +
    "\n" +
    "    <p>\r" +
    "\n" +
    "    This version of the app was <a href=\"https://github.com/stevep99/keyboard-layout-analyzer\">forked by SteveP</a> from the original <a href=\"http://patorjk.com/keyboard-layout-analyzer/\">Keyboard Layout Analyzer</a> by patorjk.\r" +
    "\n" +
    "    </p>\r" +
    "\n" +
    "    <p>A number of changes are made in this version with the aim of making the analyzer more useful and accurate, particularly in regard to the scoring calculation. \r" +
    "\n" +
    "    The changes are detailed below, so you can evaluate the merits of these changes yourself. A huge thanks to Patrick (patorjk) for releasing his source code, making this forked version possible!\r" +
    "\n" +
    "    </p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <h2>Scoring Algorithm</h2>\r" +
    "\n" +
    "    <p>\r" +
    "\n" +
    "        I have studied the source code in the original app to understand how the analyzer and scoring systems work. The following is my best interpretation of its methodology:\r" +
    "\n" +
    "    </p>\r" +
    "\n" +
    "    <p>\r" +
    "\n" +
    "        Layouts are scored according to four weighted elements:<br/>\r" +
    "\n" +
    "        - distance fingers moved (33%)<br/>\r" +
    "\n" +
    "        - distribution of work among fingers (33%)<br/>\r" +
    "\n" +
    "        - same-finger bigrams (17%)<br/>\r" +
    "\n" +
    "        - hand alternation (17%)<br/>\r" +
    "\n" +
    "    </p>\r" +
    "\n" +
    "    <p>I now present a critique of each of these elements, and where relevant, describe the changes I have made in this version of the app:</p>\r" +
    "\n" +
    "    \r" +
    "\n" +
    "    <h3>Element 1: Distance calculation</h3>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <p>The distance calculation works by simulating the typing of the input text and measuring the distance between successive keys. These distances are summed up, and a score is calculated based on the average distance moved across all key presses. This method works reasonably well but is overly simplistic. I have identified three flaws with it:<br/>\r" +
    "\n" +
    "    </p>\r" +
    "\n" +
    "    <p><b>Flaw 1</b>: no consideration is taken into account of the type of movement.</p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <img src=\"./img/kb-j-arrows.png\" width=\"142\" height=\"150\" style=\"float: left; margin-right: 10px;\"/>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <p>Consider if you start with your right hand in the home position (using Qwerty), and type JH, JU, and JM. It is more difficult to move from J to H than it is from J to U or J to H. This is because the index finger can easily stretch outward to the U or curl inward to the M. However, to type the H, the finger has to splay outwards, or the whole hand has to move. Consequently, more effort is required for this type of lateral motion. This phenomenon is well-documented in the justification behind both the Workman and Colemak-DH layouts.</p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <p>If you simply measure distance between J and its nearby keys however, then due to the keyboard stagger, JH is a shorter distance than JU or JM. In such cases, the default algorithm rewards motions involving more difficult (but slightly nearer) keys. What would be desired to fix this problem, is to replace the pure distance measure with a distance penalty, in which horizontal movements are given a higher penalty than vertical ones for the same distance moved.</p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <p>Also, the raw distance measurement does not take into account that some fingers are stronger than others, especially for motions that involve simple curling inward/outward that don't require the whole hand to move.</p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <p><b>Flaw 2</b>: Even with a directional penalty added, notice that the distance between JM and JN is the same. In reality though, again because of the stagger on standard boards, the JM movement is easier. To address this issue, we need to consider that the hands approach the keyboard at an angle. On the right-hand side of the keyboard, the arms approach the keyboard in the same direction as the stagger, but on the left-side, the stagger is effectively the wrong way around. A more accurate algorithm should aim to take this effect into account.</p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <p><b>Flaw 3</b>: The distance penalty should not linear, but rather logarithmic, as observed by <a href=\"https://en.wikipedia.org/wiki/Fitts%27s_law\">Fitts's Law</a>.\r" +
    "\n" +
    "    Fitts's Law is a predictive model of human movement which can be used to estimate the time or effort it takes to perform a variety of actions, based on the distance and size of the target.</p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <p><b><u>Fixes:</u></b> This version of the app applies fixes to the algorithm to address all these flaws.<br/>\r" +
    "\n" +
    "        - The simple distance calculation is replaced by a \"distance penalty\".<br/> \r" +
    "\n" +
    "        - The penalty is finger-dependent for actions that require a simple inward/outward curling of the finger, for example to reach upward with the middle finger from <i>K to I</i> (in Qwerty).<br/>\r" +
    "\n" +
    "        - The penalty is larger for horizontal movements, recognising that this component requires the whole hand to move or for fingers to splay out awkwardly, for example the motion of the index finger from <i>F to G</i> (in Qwerty).<br/>\r" +
    "\n" +
    "        - The coordinate system for movement vectors is rotated to align with the angle of approach of the hands. This currently set to a 10° angle, and is applied clockwise for the left hand, anticlockwise for the right hand.<br/>\r" +
    "\n" +
    "        - Fitts's Law is incorporated in this version of the analyzer so both horizontal and vertical components are appropriately scaled.</p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <table style=\"display: inline-block; margin-left:40px\" border=\"1\" cellpadding=\"2\">\r" +
    "\n" +
    "        <tbody>\r" +
    "\n" +
    "        <tr><th>finger</th><th>effort</th></tr>\r" +
    "\n" +
    "        <tr>\r" +
    "\n" +
    "            <td>index¹</td><td>1.0</td>\r" +
    "\n" +
    "        </tr>\r" +
    "\n" +
    "        <tr>\r" +
    "\n" +
    "            <td>middle¹</td><td>1.1</td>\r" +
    "\n" +
    "        </tr>\r" +
    "\n" +
    "        <tr>\r" +
    "\n" +
    "            <td>ring¹</td><td>1.3</td>\r" +
    "\n" +
    "        </tr>\r" +
    "\n" +
    "        <tr>\r" +
    "\n" +
    "            <td>pinky¹</td><td>1.6</td>\r" +
    "\n" +
    "        </tr>\r" +
    "\n" +
    "        <tr>\r" +
    "\n" +
    "            <td>horizontal motions²</td><td>2.0</td>\r" +
    "\n" +
    "        </tr>\r" +
    "\n" +
    "        <td colspan=\"2\">\r" +
    "\n" +
    "            ¹ Relative effort for vertical finger curling motion.<br/>\r" +
    "\n" +
    "            ² Relative effort for whole hand horizontal motion.\r" +
    "\n" +
    "            </td>\r" +
    "\n" +
    "        </tbody>\r" +
    "\n" +
    "    </table>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <!--\r" +
    "\n" +
    "    <p>The effect of the new distance penalty model compared to the raw physical distance:</p>\r" +
    "\n" +
    "    \r" +
    "\n" +
    "    <table style=\"display: inline-block; margin-left:40px\" border=\"1\" cellpadding=\"2\">\r" +
    "\n" +
    "        <tbody>\r" +
    "\n" +
    "        <tr><th>keys</th><th>distance¹</th><th>penalty²</th></tr>\r" +
    "\n" +
    "        <tr>\r" +
    "\n" +
    "        <td>JU</td><td>1.03u</td><td>1.04</td>\r" +
    "\n" +
    "        </tr>\r" +
    "\n" +
    "        <tr>\r" +
    "\n" +
    "        <td>JH</td><td>1.00u</td><td>1.99</td>\r" +
    "\n" +
    "        </tr>\r" +
    "\n" +
    "        <tr>\r" +
    "\n" +
    "        <td>JN</td><td>1.12u</td><td>1.74</td>\r" +
    "\n" +
    "        </tr>\r" +
    "\n" +
    "        <tr>\r" +
    "\n" +
    "        <td>JM</td><td>1.12u</td><td>1.32</td>\r" +
    "\n" +
    "        </tr>\r" +
    "\n" +
    "        </tbody>\r" +
    "\n" +
    "        <tfoot>\r" +
    "\n" +
    "        <tr>\r" +
    "\n" +
    "        <td colspan=\"3\">\r" +
    "\n" +
    "        ¹ Actual physical distance in key units<br/>\r" +
    "\n" +
    "        ² Distance penalty as calculated in this version of the app by applying the fixes.\r" +
    "\n" +
    "        </td>\r" +
    "\n" +
    "        </tr>\r" +
    "\n" +
    "        </tfoot>\r" +
    "\n" +
    "    </table>    \r" +
    "\n" +
    "    -->\r" +
    "\n" +
    "    <p>With these fixes, this element of the scoring system is now more highly prioritised, increasing from 33% to 50%.</p>\r" +
    "\n" +
    "            \r" +
    "\n" +
    "    <h3>Element 2: Finger distribution</h3>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <p>The original algorithm defines a score value for each finger as follows:<br/>\r" +
    "\n" +
    "        PINKY: 0.5<br/>\r" +
    "\n" +
    "        RING: 1.0<br/>\r" +
    "\n" +
    "        MIDDLE: 4.0<br/>\r" +
    "\n" +
    "        INDEX: 2.0<br/>\r" +
    "\n" +
    "        THUMB: 0.5<br/>\r" +
    "\n" +
    "    </p>\r" +
    "\n" +
    "    <p>Then, it calculates what proportion of typing is done on each finger, subject to a maximum of 20% per finger. The final score is proportional to this sum over all fingers:\r" +
    "\n" +
    "    (finger-score) x (finger-frequency)</p>\r" +
    "\n" +
    "    <p>The consequence of this algorithm is that middle finger is heavily favoured, even compared to the index finger. Layouts deemed high scoring would be those that assign 20% of the work to favoured fingers - middle especially followed by index - but with very little or none on pinkies and thumbs. I think this method may be flawed in that it too heavily weights the middle finger, and encourages loading of favoured fingers upto the seemingly arbitrary 20%. However, I accept that this element of the algorithm may in fact be counter-balanced by the distance algorithm, which would reward all home key usage (including pinkies and thumbs where defined), by assigning a movement distance of zero in those cases.</p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <p><b><u>Fix:</u></b> A simpler effort calculation is employed based on the finger weightings in the table above, representing the relative strength of each finger.\r" +
    "\n" +
    "        Additionally, a small finger-imbalance factor has been introduced to this element, recognising that a good layout should assign rougly equal work symmetrically to fingers of both left and right hands. \r" +
    "\n" +
    "        That is, if the left-index finger performs 15% of key presses, the right-index finger should do similarly.</p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <p>I have reduced the weighting of this element of the scoring from 33% to 20%.</p>\r" +
    "\n" +
    "    \r" +
    "\n" +
    "    <h3>Element 3: Same-finger bigrams</h3>\r" +
    "\n" +
    "    <p>The original app simply counts what proportion of each key presses and done with the same finger as the previous one. It then calculates a percentage score based on the same-finger ratio in the range 0 to 10%. In other worlds, a layout with a 5% same-finger ratio, would score 50% in this element.</p>\r" +
    "\n" +
    "    <p><b><u>Fix:</u></b> No fix needed. The weighting of this element of the calculation is increased from 17% to 30%.<br/>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <h3>Element 4: Hand alternation</h3>\r" +
    "\n" +
    "    <p>Similar to the same-finger count, it simply counts which proportion of key presses were with same hand as the previous one. This favours heavily alternating layouts. However, in my view this flawed, as no account is taken that some same-hand combinations are actually some of the most comfortable bigrams of all: the Colemak ST and NE, or the Dvorak TH, for examples. Perhaps this element could be improved, for example to detect longer same-hand sequences which would be detrimental. In it's current form though, I don't see much value in this element.</p>\r" +
    "\n" +
    "    <p><b><u>Fix:</u></b> Removed from the scoring calculation.<br/>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <h2>Other changes made from the original repo</h2>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <ul>\r" +
    "\n" +
    "        <li>There were a lot of seemingly random, unrecognised layouts. I removed most of them. The list now only contains layouts that are at least semi-well-known in the community.</li>\r" +
    "\n" +
    "        <li>The Colemak-DH layout variants have been added.</li>\r" +
    "\n" +
    "        <li>Number of layouts in the comparison changed from 5 to 6.</li>\r" +
    "\n" +
    "        <li>Removed the generated 'Personalized Layout' as I considered it to not really have any value.</li>\r" +
    "\n" +
    "        <li>Added support for additional keyboard types.</li>\r" +
    "\n" +
    "        <li>Various other input texts have been added, these were obtained from from <a href=\"https://bitbucket.org/Shenafu/keyboard-layout-analyzer/src/master/\">shenafu's fork</a> of the same app.</li>\r" +
    "\n" +
    "        <li>Disabled the API functionality (e.g. link to results) as github hosting does not support php.</li>\r" +
    "\n" +
    "    </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <h2>Bugs</h2>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <p>Please report bugs at the <a href=\"https://github.com/stevep99/keyboard-layout-analyzer/issues\">issue tracker</a> on github.</p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('partials/config.htm',
    "<div>\r" +
    "\n" +
    "    <div class=\"jumbotron subhead\">\r" +
    "\n" +
    "        <h1>Configuration</h1>\r" +
    "\n" +
    "        <p class=\"lead\"><strong>Click</strong> or <strong>Drag</strong> the keys on the keyboard below<p>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <p></p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div id='kb-config-container'>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <keyboardeditor name=\"0\" current=\"current\"></keyboardeditor>\r" +
    "\n" +
    "        <keyboardeditor name=\"1\" current=\"current\"></keyboardeditor>\r" +
    "\n" +
    "        <keyboardeditor name=\"2\" current=\"current\"></keyboardeditor>\r" +
    "\n" +
    "        <keyboardeditor name=\"3\" current=\"current\"></keyboardeditor>\r" +
    "\n" +
    "        <keyboardeditor name=\"4\" current=\"current\"></keyboardeditor>\r" +
    "\n" +
    "        <keyboardeditor name=\"5\" current=\"current\"></keyboardeditor>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <table class=\"kb-config-table\">\r" +
    "\n" +
    "            <thead>\r" +
    "\n" +
    "                <th>\r" +
    "\n" +
    "                    Properties\r" +
    "\n" +
    "                </th>\r" +
    "\n" +
    "                <th>\r" +
    "\n" +
    "                    Data\r" +
    "\n" +
    "                </th>\r" +
    "\n" +
    "            </thead>\r" +
    "\n" +
    "            <tbody>\r" +
    "\n" +
    "                <tr>\r" +
    "\n" +
    "                    <td class=\"kb-config-td\">\r" +
    "\n" +
    "                        <div class=\"kb-config-editor\">\r" +
    "\n" +
    "                            <form class='form-horizontal'>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <div class='control-group'>\r" +
    "\n" +
    "                                    <label class='control-label' for=\"kb-config-name\">Name:</label>\r" +
    "\n" +
    "                                    <div class='controls'>\r" +
    "\n" +
    "                                        <input id=\"kb-config-name\" class=\"kb-config-name\" type=\"text\" ng-model=\"keyboards.getLayout(current).keySet.label\"/>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <div class='control-group'>\r" +
    "\n" +
    "                                    <label class='control-label' for=\"kb-config-kbtype\">Submitted By:</label>\r" +
    "\n" +
    "                                    <div class='controls'>\r" +
    "\n" +
    "                                        <div style='padding:5px 7px;'>{{keyboards.getLayout(current).keySet.author}}</div>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <div class='control-group'>\r" +
    "\n" +
    "                                    <label class='control-label' for=\"kb-config-kbtype\">More Info:</label>\r" +
    "\n" +
    "                                    <div class='controls'>\r" +
    "\n" +
    "                                        <div ng-hide='keyboards.getLayout(current).keySet.moreInfoUrl' style='padding:5px 7px;'>    None</div>\r" +
    "\n" +
    "                                        <div ng-show='keyboards.getLayout(current).keySet.moreInfoUrl' style='padding:5px 7px;'>\r" +
    "\n" +
    "                                            <a href='{{keyboards.getLayout(current).keySet.moreInfoUrl}}'>{{keyboards.getLayout(current).keySet.moreInfoText}}</a>\r" +
    "\n" +
    "                                        </div>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                            </form>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </td>\r" +
    "\n" +
    "                    <td class=\"kb-config-td\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <div class=\"kb-config-editor\">\r" +
    "\n" +
    "                            <form class='form-horizontal'>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <div class='control-group'>\r" +
    "\n" +
    "                                    <label class='control-label'>Load/Save:</label>\r" +
    "\n" +
    "                                    <div class='controls'>\r" +
    "\n" +
    "                                        <button class=\"kb-config-import btn\" ng-click=\"showImportDialog()\">Import</button>\r" +
    "\n" +
    "                                        <button class=\"kb-config-export btn\" ng-click=\"showExportDialog()\">Export</button>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                                <div class='control-group'>\r" +
    "\n" +
    "                                    <label class='control-label' for=\"kb-config-select-list\">Preset:</label>\r" +
    "\n" +
    "                                    <div class='controls'>\r" +
    "\n" +
    "                                        <select id=\"kb-config-select-list\" class=\"kb-config-select-list\">\r" +
    "\n" +
    "                                            <option value=\"none\">[Select Layout]</option>\r" +
    "\n" +
    "                                            <optgroup label=\"ANSI Keyboards\">\r" +
    "\n" +
    "                                                <option value=\"standard.abcdef\">ABCDEF</option>\r" +
    "\n" +
    "                                                <option value=\"standard.arensito\">Arensito</option>\r" +
    "\n" +
    "                                                <option value=\"standard.adnw\">AdnW</option>\r" +
    "\n" +
    "                                                <option value=\"standard.asset\">Asset</option>\r" +
    "\n" +
    "                                                <option value=\"standard.capewell\">Capewell</option>\r" +
    "\n" +
    "                                                <option value=\"standard.carpalxq\">CarpalxQ</option>\r" +
    "\n" +
    "                                                <option value=\"standard.colemak\">Colemak</option>\r" +
    "\n" +
    "                                                <option value=\"standard.tarmak1\">Colemak - Tarmak 1</option>\r" +
    "\n" +
    "                                                <option value=\"standard.tarmak2\">Colemak - Tarmak 2</option>\r" +
    "\n" +
    "                                                <option value=\"standard.tarmak3\">Colemak - Tarmak 3</option>\r" +
    "\n" +
    "                                                <option value=\"standard.tarmak4\">Colemak - Tarmak 4</option>\r" +
    "\n" +
    "                                                <option value=\"standard.colemak_dh\">Colemak-DH (Mod-DH)</option>\r" +
    "\n" +
    "                                                <option value=\"standard.tarmak1_dh\">Colemak-DH - Tarmak 1</option>\r" +
    "\n" +
    "                                                <option value=\"standard.tarmak2_dh\">Colemak-DH - Tarmak 2</option>\r" +
    "\n" +
    "                                                <option value=\"standard.tarmak3_dh\">Colemak-DH - Tarmak 3</option>\r" +
    "\n" +
    "                                                <option value=\"standard.tarmak4_dh\">Colemak-DH - Tarmak 4</option>\r" +
    "\n" +
    "                                                <option value=\"standard.simplifiedDvorak\">Dvorak (Simplified)</option>\r" +
    "\n" +
    "                                                <option value=\"standard.programmerDvorak\">Dvorak (Programmer)</option>\r" +
    "\n" +
    "                                                <option value=\"standard.spanish-dvorak\">Dvorak (Spanish)</option>\r" +
    "\n" +
    "                                                <option value=\"standard.klausler\">Klausler</option>\r" +
    "\n" +
    "                                                <option value=\"standard.minimak8key\">Minimak 8-key</option>\r" +
    "\n" +
    "                                                <option value=\"standard.minimak12key\">Minimak 12-key</option>\r" +
    "\n" +
    "                                                <option value=\"standard.mtgap\">MTGAP</option>\r" +
    "\n" +
    "                                                <option value=\"standard.neo2\">Neo 2 (v1)</option>\r" +
    "\n" +
    "                                                <option value=\"standard.neo2_new\">Neo 2 (v2)</option>\r" +
    "\n" +
    "                                                <option value=\"standard.niro\">Niro</option>\r" +
    "\n" +
    "                                                <option value=\"standard.norman\">Norman</option>\r" +
    "\n" +
    "                                                <option value=\"standard.ohdvorakl\">One-handed Dvorak (Left)</option>\r" +
    "\n" +
    "                                                <option value=\"standard.ohdvorakr\">One-handed Dvorak (Right)</option>\r" +
    "\n" +
    "                                                <option value=\"standard.qgmlwy\">QGMLWY</option>\r" +
    "\n" +
    "                                                <option value=\"standard.qwerfj\">QWERFJ</option>\r" +
    "\n" +
    "                                                <option value=\"standard.qwerty\">QWERTY</option>\r" +
    "\n" +
    "                                                <option value=\"standard.qwertywm\">QWERTY - Wide Mod</option>\r" +
    "\n" +
    "                                                <option value=\"standard.qwpr\">QWPR</option>\r" +
    "\n" +
    "                                                <option value=\"standard.russian\">Russian</option>\r" +
    "\n" +
    "                                                <option value=\"standard.soul\">Soul</option>\r" +
    "\n" +
    "                                                <option value=\"standard.workman\">Workman</option>\r" +
    "\n" +
    "                                            </optgroup>\r" +
    "\n" +
    "                                            <optgroup label=\"ISO Keyboards\">\r" +
    "\n" +
    "                                                <option value=\"european.azerty\">AZERTY</option>\r" +
    "\n" +
    "                                                <option value=\"european.bepo\">BÉPO</option>\r" +
    "\n" +
    "                                                <option value=\"european.colemak\">Colemak</option>\r" +
    "\n" +
    "                                                <option value=\"european_ss.colemak\">Colemak split-space</option>\r" +
    "\n" +
    "                                                <option value=\"european.colemak_dh\">Colemak-DH (Mod-DH)</option>\r" +
    "\n" +
    "                                                <option value=\"european_ss.colemak_dh\">Colemak-DH (Mod-DH) split-space</option>\r" +
    "\n" +
    "                                                <option value=\"european.tarmak1_dh\">Colemak-DH - Tarmak 1</option>\r" +
    "\n" +
    "                                                <option value=\"european.tarmak2_dh\">Colemak-DH - Tarmak 2</option>\r" +
    "\n" +
    "                                                <option value=\"european.tarmak3_dh\">Colemak-DH - Tarmak 3</option>\r" +
    "\n" +
    "                                                <option value=\"european.tarmak4_dh\">Colemak-DH - Tarmak 4</option>\r" +
    "\n" +
    "                                                <option value=\"european.qwerty\">QWERTY</option>\r" +
    "\n" +
    "                                                <option value=\"european_ss.qwerty\">QWERTY split-space</option>\r" +
    "\n" +
    "                                                <option value=\"european.qwerty-spanish\">QWERTY (Spanish)</option>\r" +
    "\n" +
    "                                                <option value=\"european.qwerty-estonian\">QWERTY (Estonian)</option>\r" +
    "\n" +
    "                                            </optgroup>\r" +
    "\n" +
    "                                            <optgroup label=\"Japanese Keyboards\">\r" +
    "\n" +
    "                                                <option value=\"japanese.jis\">JIS 109</option>\r" +
    "\n" +
    "                                            </optgroup>\r" +
    "\n" +
    "                                            <optgroup label=\"Matrix Keyboards\">\r" +
    "\n" +
    "                                                <option value=\"matrix.qwerty\">QWERTY</option>\r" +
    "\n" +
    "                                                <option value=\"matrix.colemak\">Colemak</option>\r" +
    "\n" +
    "                                                <option value=\"matrix.colemak_dh\">Colemak-DH (Mod-DH)</option>\r" +
    "\n" +
    "                                                <option value=\"matrix.dvorak\">Dvorak</option>\r" +
    "\n" +
    "                                                <option value=\"matrix.norman\">Norman</option>\r" +
    "\n" +
    "                                                <option value=\"matrix.workman\">Workman</option>\r" +
    "\n" +
    "                                            </optgroup>\r" +
    "\n" +
    "                                            <optgroup label=\"Ergodox Keyboards\">\r" +
    "\n" +
    "                                                <option value=\"ergodox.colemak\">Colemak</option>\r" +
    "\n" +
    "                                                <option value=\"ergodox.colemak-thumbshift\">Colemak thumbshift</option>\r" +
    "\n" +
    "                                                <option value=\"ergodox.colemak_dh\">Colemak-DH (Mod-DH) thumbshift</option>\r" +
    "\n" +
    "                                                <option value=\"ergodox.maltron\">Maltron</option>\r" +
    "\n" +
    "                                                <option value=\"ergodox.mtgap\">MTGAP</option>\r" +
    "\n" +
    "                                                <option value=\"ergodox.mtgap-thumbshift\">MTGAP thumbshift</option>\r" +
    "\n" +
    "                                                <option value=\"ergodox.qgmlwbcub\">QGMLWB</option>\r" +
    "\n" +
    "                                                <option value=\"ergodox.qgmlwycub\">QGMLWY</option>\r" +
    "\n" +
    "                                                <option value=\"ergodox.qwerty\">QWERTY</option>\r" +
    "\n" +
    "                                                <option value=\"ergodox.qwerty-thumbshift\">QWERTY thumbshift</option>\r" +
    "\n" +
    "                                                <option value=\"ergodox.rsthd\">RSTHD</option>\r" +
    "\n" +
    "                                                <option value=\"ergodox.norman\">Norman</option>\r" +
    "\n" +
    "                                                <option value=\"ergodox.workman\">Workman</option>\r" +
    "\n" +
    "                                                <option value=\"ergodox.kinesis-advantage-colemak\">Colemak (Kinesis Advantage)</option>\r" +
    "\n" +
    "                                            </optgroup>\r" +
    "\n" +
    "                                        </select>\r" +
    "\n" +
    "                                        <button class=\"kb-config-load btn\" ng-click=\"loadLayout()\">Load</button>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "<!--\r" +
    "\n" +
    "                                <div class='control-group'>\r" +
    "\n" +
    "                                    <label class='control-label'>Share:</label>\r" +
    "\n" +
    "                                    <div class='controls'>\r" +
    "\n" +
    "                                        <button class=\"btn\" ng-click=\"submitDialog()\">Submit Layout</button>\r" +
    "\n" +
    "                                    </div>\r" +
    "\n" +
    "                                </div>\r" +
    "\n" +
    "-->\r" +
    "\n" +
    "                            </form>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </td>\r" +
    "\n" +
    "                </tr>\r" +
    "\n" +
    "            </tbody>\r" +
    "\n" +
    "        </table>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <paginate start=\"1\" stop=\"6\" handler=\"switchLayout\"></paginate>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <!-- import modal -->\r" +
    "\n" +
    "        <div id='kb-config-import-dialog' class='modal hide fade' tabindex='-1' role='dialog' aria-labelledby='resultLabel' aria-hidden='true'>\r" +
    "\n" +
    "            <div class='modal-header'>\r" +
    "\n" +
    "                <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>x</button>\r" +
    "\n" +
    "                <h3 id='resultLabel'>Import Layout</h3>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class='modal-body'>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <textarea class='input-block-level kb-config-dialog-txt'></textarea>\r" +
    "\n" +
    "                <p class='text-left'>\r" +
    "\n" +
    "                    Paste the text of a previously exported layout in the textbox above and press \"Import\" to load the layout.\r" +
    "\n" +
    "                </p>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class='modal-footer'>\r" +
    "\n" +
    "                <button class=\"btn\" ng-click=\"importLayout()\">Import</button>\r" +
    "\n" +
    "                <button class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">Close</button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <!-- import modal -->\r" +
    "\n" +
    "        <div id='kb-config-export-dialog' class='modal hide fade' tabindex='-1' role='dialog' aria-labelledby='resultLabel' aria-hidden='true'>\r" +
    "\n" +
    "            <div class='modal-header'>\r" +
    "\n" +
    "                <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>x</button>\r" +
    "\n" +
    "                <h3 id='resultLabel'>Export Layout</h3>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class='modal-body'>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <textarea class='input-block-level kb-config-dialog-txt'></textarea>\r" +
    "\n" +
    "                <p class='text-left'>\r" +
    "\n" +
    "                    The above text represents the keyboard layout. You can come back to the app later and load this layout with this text using the \"Import\" feature.\r" +
    "\n" +
    "                </p>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class='modal-footer'>\r" +
    "\n" +
    "                <button class=\"btn\" ng-click=\"selectAllExportText()\">Select All</button>\r" +
    "\n" +
    "                <button class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">Close</button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <!-- submit modal -->\r" +
    "\n" +
    "        <div id='kb-config-submit-dialog' class='modal hide fade' tabindex='-1' role='dialog' aria-labelledby='resultLabel' aria-hidden='true'>\r" +
    "\n" +
    "            <div class='modal-header'>\r" +
    "\n" +
    "                <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>x</button>\r" +
    "\n" +
    "                <h3 id='resultLabel'>Submit Layout</h3>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class='modal-body'>\r" +
    "\n" +
    "                <form class='form-horizontal' ng-show='!submitter.submitting'>\r" +
    "\n" +
    "                    <div class='control-group'>\r" +
    "\n" +
    "                        <label class='control-label' for='sub-name'>Name:</label>\r" +
    "\n" +
    "                        <div class='controls'>\r" +
    "\n" +
    "                            <input id='sub-name' class='input-block-level' type='text' ng-model='submitter.name'>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class='control-group'>\r" +
    "\n" +
    "                        <label class='control-label' for='sub-email'>Email:</label>\r" +
    "\n" +
    "                        <div class='controls'>\r" +
    "\n" +
    "                            <input id='sub-email' class='input-block-level' type='text' ng-model='submitter.email'>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class='control-group'>\r" +
    "\n" +
    "                        <label class='control-label' for='sub-url'>URL:</label>\r" +
    "\n" +
    "                        <div class='controls'>\r" +
    "\n" +
    "                            <input id='sub-url' class='input-block-level' type='text' ng-model='submitter.url'>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </form>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div ng-show='submitter.submitting'>\r" +
    "\n" +
    "                    <p>\r" +
    "\n" +
    "                        <img src='img/loading2.gif'>\r" +
    "\n" +
    "                    </p>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <p class='text-left'>\r" +
    "\n" +
    "                    Fill out the above information and then press \"Submit\". After submitting, you're layout will be evaluated and then placed into the \"Preset\" option.\r" +
    "\n" +
    "                </p>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class='modal-footer'>\r" +
    "\n" +
    "                <button class=\"btn\" ng-click=\"submitLayout()\">Submit</button>\r" +
    "\n" +
    "                <button class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">Close</button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('partials/load.htm',
    "<div class='loading-container text-center'>\r" +
    "\n" +
    "    <p>\r" +
    "\n" +
    "    	<img src='http://patorjk.com/images/qwerty.png'/>\r" +
    "\n" +
    "    </p>\r" +
    "\n" +
    "    <p>\r" +
    "\n" +
    "    	<img src='img/loading2.gif'>\r" +
    "\n" +
    "    </p>\r" +
    "\n" +
    "    Loading, one moment please...\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('partials/main.htm',
    "<div>\r" +
    "\n" +
    "    <div class=\"jumbotron subhead\">\r" +
    "\n" +
    "        This is SteveP's fork of patorjk's Keyboard Layout Analyzer, featuring new functionality and improved analytics. See the <a href=\"#/about\">About Page</a> for a detailed explanation.\r" +
    "\n" +
    "        <br/>\r" +
    "\n" +
    "        <br/>\r" +
    "\n" +
    "        <h1>Analyze Text Input</h1>\r" +
    "\n" +
    "        <p class=\"lead\">See which layout is best for your input text<p>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <form class='form-horizontal'>\r" +
    "\n" +
    "        <div class='control-group'>\r" +
    "\n" +
    "            <label class='control-label' for='txt-input'>Text to Analyze:</label>\r" +
    "\n" +
    "            <div class='controls'>\r" +
    "\n" +
    "                <textarea id='txt-input' class='input-block-level' ng-model='data.text'></textarea>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class='control-group'>\r" +
    "\n" +
    "            <label class='control-label' for='text-presets'>Text Presets:</label>\r" +
    "\n" +
    "            <div class='controls'>\r" +
    "\n" +
    "                <select id='text-presets' ng-model='data.textPreset' ng-change=\"applyPreset()\">\r" +
    "\n" +
    "                    <option value='' selected>[Select Text to Load]</option>\r" +
    "\n" +
    "                    <option value='alice-ch1' selected>English: Alice in Wonderland, Chapter 1</option>\r" +
    "\n" +
    "                    <option value='common-english-words'>English: List of the most commonly used words</option>\r" +
    "\n" +
    "                    <option value='common-sat-words'>English: Most commonly used SAT words</option>\r" +
    "\n" +
    "                    <option value='magna-carta-english'>English: Magna Carta</option>\r" +
    "\n" +
    "                    <option value='nineteen-eighty-four-ch1'>English: 1984, Chapter 1</option>\r" +
    "\n" +
    "                    <option value='tarzan-of-the-apes'>English: Tarzan Of The Apes</option>\r" +
    "\n" +
    "                    <option value='jungle-book'>English: Jungle Book</option>\r" +
    "\n" +
    "                    <option value='difficultwords'>English: Difficult words</option>\r" +
    "\n" +
    "                    <option value='medical'>English: Medical words</option>\r" +
    "\n" +
    "                    <option value='quotes'>English: Quotes</option>\r" +
    "\n" +
    "                    <option value='daode-jing'>English: Tao te Ching / DaodeJing</option>\r" +
    "\n" +
    "                    <option value='bigrams'>English: Bigrams</option>\r" +
    "\n" +
    "                    <option value='academic-1'>English: Academic - Cost Optimization Model</option>\r" +
    "\n" +
    "                    <option value='academic-2'>English: Academic - Contractors' Performance in Construction</option>\r" +
    "\n" +
    "                    <option value='academic-3'>English: Academic - Binary Logistic Analysis</option>\r" +
    "\n" +
    "                    <option value='lorem'>Lorem Ipsum</option>\r" +
    "\n" +
    "                    <option value='gol'>Tech: Game of Life</option>\r" +
    "\n" +
    "                    <option value='pi1000'>Tech: Pi 1000</option>\r" +
    "\n" +
    "                    <option value='pptt'>Tech: Programming Punctuation Torture Test</option>\r" +
    "\n" +
    "                </select>\r" +
    "\n" +
    "                <!-- <button class='btn' type='button' ng-click='applyPreset()'>Apply</button> -->\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class='control-group'>\r" +
    "\n" +
    "            <div class='controls'>\r" +
    "\n" +
    "                <button class=\"btn btn-large\" type=\"button\" ng-click=\"generateOutput(data.text)\">See Which Layout is Best</button>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('partials/paginate.htm',
    "<div class=\"pagination pagination\">\r" +
    "\n" +
    "    <ul>\r" +
    "\n" +
    "        <li class=\"switcher\" num=\"prev\" ng-click=\"handleNav($event, start*1,'prev')\">\r" +
    "\n" +
    "            <a href=\"javascript:void(0);\" >←</a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <li ng-repeat='ii in [start, stop] | makeRange' \r" +
    "\n" +
    "            ng-class=\"{switcher: true, active: ($index === current)}\" \r" +
    "\n" +
    "            num=\"$index\" ng-click=\"handleNav($event, start*1, $index)\">\r" +
    "\n" +
    "            <a href=\"javascript:void(0);\" >{{start*1+$index}}</a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <li class=\"switcher\" num=\"next\" ng-click=\"handleNav($event, start*1, 'next')\">\r" +
    "\n" +
    "            <a href=\"javascript:void(0);\" >→</a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "    </ul>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('partials/result-options.htm',
    "<div class='text-center kla-result-opts'>\r" +
    "\n" +
    "    <!--<h4 class='text-center kla-display-opts-header'>Result Table Display Options</h4>-->\r" +
    "\n" +
    "    <div class=\"btn-group text-left\">\r" +
    "\n" +
    "        <button data-toggle=\"dropdown\" class=\"btn dropdown-toggle\"  data-placeholder=\"false\">Units: {{source.units}}<span class=\"caret\"></span></button>\r" +
    "\n" +
    "        <ul class=\"dropdown-menu\">\r" +
    "\n" +
    "            <li ng-repeat=\"curUnit in source.allowedUnits\">\r" +
    "\n" +
    "                <input type=\"radio\" name='kla-opt{{settings.id}}-unit-radio' id=\"kla-opt{{settings.id}}-units-{{$index}}\" ng-model=\"source.units\" value='{{curUnit}}'><label for=\"kla-opt{{settings.id}}-units-{{$index}}\" >{{curUnit}}</label>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "        </ul>\r" +
    "\n" +
    "    </div> \r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"btn-group text-left\" style='display:{{settings.showDisplayType}}'>\r" +
    "\n" +
    "        <button data-toggle=\"dropdown\" class=\"btn dropdown-toggle\"  data-placeholder=\"false\">Display: {{source.displayType}}<span class=\"caret\"></span></button>\r" +
    "\n" +
    "        <ul class=\"dropdown-menu\">\r" +
    "\n" +
    "            <li ng-repeat=\"(dType, dValue) in source.displayData track by $index\">\r" +
    "\n" +
    "                <input type=\"radio\" name='kla-opt{{settings.id}}-unit-radio' id=\"kla-opt{{settings.id}}-d-{{$index}}\" ng-model=\"source.displayType\" value='{{dType}}'><label for=\"kla-opt{{settings.id}}-d-{{$index}}\" >{{dType}}</label>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "        </ul>\r" +
    "\n" +
    "    </div> \r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"btn-group text-left\">\r" +
    "\n" +
    "        <button data-toggle=\"dropdown\" class=\"btn dropdown-toggle\"  data-placeholder=\"false\">Keyboards <span class=\"caret\"></span></button>\r" +
    "\n" +
    "        <ul class=\"dropdown-menu\">\r" +
    "\n" +
    "            <li ng-repeat=\"layout in source.seriesData.allSeriesLabels\">\r" +
    "\n" +
    "                <input type=\"checkbox\" id=\"kla-opt{{settings.id}}-dd-{{$index}}\" ng-model=\"source.rawSeriesData[$index].visible\"><label for=\"kla-opt{{settings.id}}-dd-{{$index}}\" >{{layout}}</label>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "        </ul>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('partials/result-table.htm',
    "<table class='kla-table-data'>\r" +
    "\n" +
    "    <thead>\r" +
    "\n" +
    "        <tr>\r" +
    "\n" +
    "            <th>\r" +
    "\n" +
    "            </th>\r" +
    "\n" +
    "            <th ng-repeat=\"header in source.displayData[source.displayType]\">\r" +
    "\n" +
    "                <div class='text-right kla-table-data-text kla-padding-left'>{{header.label}}</div>\r" +
    "\n" +
    "            </th>\r" +
    "\n" +
    "            <th>\r" +
    "\n" +
    "                <div class='text-right kla-table-data-text kla-padding-left'>Total</div>\r" +
    "\n" +
    "            </th>\r" +
    "\n" +
    "        </tr>\r" +
    "\n" +
    "    </thead>\r" +
    "\n" +
    "    <tbody>\r" +
    "\n" +
    "        <tr ng-repeat=\"layout in source.seriesData.seriesLabels\">\r" +
    "\n" +
    "            <td><div class='text-right'>{{layout}}</div></td>\r" +
    "\n" +
    "            <td class='kla-table-data-text' ng-repeat=\"dataPoint in source.seriesData[$index] track by $id($index)\">\r" +
    "\n" +
    "                <div class='text-right'>{{format(dataPoint)}}</div>\r" +
    "\n" +
    "            </td>\r" +
    "\n" +
    "            <td class='kla-table-data-text'>\r" +
    "\n" +
    "                <div class='text-right kla-padding-left-total'>{{format(source.seriesData[$index].total)}}</div>\r" +
    "\n" +
    "            </td>\r" +
    "\n" +
    "        </tr>\r" +
    "\n" +
    "    </tbody>\r" +
    "\n" +
    "</table>"
  );


  $templateCache.put('partials/results.htm',
    "<div>\r" +
    "\n" +
    "    <div class=\"jumbotron subhead\">\r" +
    "\n" +
    "        <h1>Results</h1>\r" +
    "\n" +
    "        <p class=\"lead\">See each tab for detailed analysis<p>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <ul class='nav nav-pills' id='main-output-tabs'>\r" +
    "\n" +
    "        <li class='kla-pill active'><a ng-click='tabSwitch($event, \"summary\")' href='#summary'>Summary</a></li>\r" +
    "\n" +
    "        <li class='kla-pill'><a ng-click='tabSwitch($event, \"distance\")' href='#distance'>Distance</a></li>\r" +
    "\n" +
    "        <li class='kla-pill'><a ng-click='tabSwitch($event, \"fingerUsage\")' href='#fingerUsage'>Finger Usage</a></li>\r" +
    "\n" +
    "        <li class='kla-pill'><a ng-click='tabSwitch($event, \"rowUsage\")' href='#rowUsage'>Row Usage</a></li>\r" +
    "\n" +
    "        <li class='kla-pill'><a ng-click='tabSwitch($event, \"heatMaps\")' href='#heatMaps'>Heat Maps</a></li>\r" +
    "\n" +
    "        <li class='kla-pill'><a ng-click='tabSwitch($event, \"miscellaneous\")' href='#miscellaneous'>Miscellaneous</a></li>\r" +
    "\n" +
    "        <!-- <li class='kla-pill'><a ng-click='tabSwitch($event, \"personalized\")' href='#personalized'>Personalized</a></li> -->\r" +
    "\n" +
    "    </ul>\r" +
    "\n" +
    "    <div class='tab-content'>\r" +
    "\n" +
    "        <div class='tab-pane active' id='summary'>\r" +
    "\n" +
    "            <div style='text-align:center; position:relative;'>\r" +
    "\n" +
    "                <img src='./img/trophy-32.png' style='display:inline-block; position:relative; top:-4px;margin-right:6px;'>\r" +
    "\n" +
    "                <div style='display:inline-block' class='best-layout'>{{results.summary.bestLayout}}</div>\r" +
    "\n" +
    "                \r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <p>\r" +
    "\n" +
    "                <div class=\"kla-result-table\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <table class='kla-table-data kla-table-data-narrow'>\r" +
    "\n" +
    "                        <thead>\r" +
    "\n" +
    "                            <tr>\r" +
    "\n" +
    "                                <th width=\"50px\">\r" +
    "\n" +
    "                                    <div class='text-right'>Rank</div>\r" +
    "\n" +
    "                                </th>\r" +
    "\n" +
    "                                <th width=\"20px\">\r" +
    "\n" +
    "                                </th>\r" +
    "\n" +
    "                                <th>\r" +
    "\n" +
    "                                    <div class='text-left'>Type</div>\r" +
    "\n" +
    "                                </th>\r" +
    "\n" +
    "                                <th>\r" +
    "\n" +
    "                                    <div class='text-left'>Layout</div>\r" +
    "\n" +
    "                                </th>\r" +
    "\n" +
    "                                <th>\r" +
    "\n" +
    "                                    <div class='text-right'>Score</div>\r" +
    "\n" +
    "                                </th>\r" +
    "\n" +
    "                            </tr>\r" +
    "\n" +
    "                        </thead>\r" +
    "\n" +
    "                        <tbody>\r" +
    "\n" +
    "    \r" +
    "\n" +
    "                            <tr ng-repeat=\"layout in results.summary.rankedLayouts\" >\r" +
    "\n" +
    "                                <td><div class='text-right'>#{{$index + 1}}</div></td>\r" +
    "\n" +
    "                                <td></td>\r" +
    "\n" +
    "                                <td><div class='text-left'>{{layout.hardwareType}}</div></td>\r" +
    "\n" +
    "                                <td><div class='text-left'>{{layout.layoutName}}</div></td>\r" +
    "\n" +
    "                                <td><div class='text-right'>{{layout.score.toFixed(2)}}</div></td>\r" +
    "\n" +
    "                            </tr>\r" +
    "\n" +
    "                    \r" +
    "\n" +
    "                        </tbody>\r" +
    "\n" +
    "                    </table>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </p>\r" +
    "\n" +
    "            <p>\r" +
    "\n" +
    "                The layout score is based on a weighed calculation that factors in\r" +
    "\n" +
    "                a distance penalty due to how much your fingers moved (50%), \r" +
    "\n" +
    "                how often you use particular fingers (20%),\r" +
    "\n" +
    "                and how often you switch fingers while typing (30%).\r" +
    "\n" +
    "                See the About page for detailed information.\r" +
    "\n" +
    "            </p>\r" +
    "\n" +
    "            <!--\r" +
    "\n" +
    "            <p>\r" +
    "\n" +
    "                <div class='text-center' ng-show='share.showSection'>\r" +
    "\n" +
    "                    <button class='btn' style='position:relative;margin-top:-12px;margin-right:10px;' ng-click='getUrlToShare()'>Get URL to Share Results →</button>\r" +
    "\n" +
    "                    <input type='text' ng-model='share.url' style='width:475px;' />\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </p>\r" +
    "\n" +
    "            -->\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class='tab-pane' id='distance' style='position:relative'>\r" +
    "\n" +
    "            <seriesbarchart width=\"940px\" height=\"300px\" source=\"results.distance\"></seriesbarchart>\r" +
    "\n" +
    "            <resulttable source='results.distance'></resulttable>\r" +
    "\n" +
    "            <resultoptions source='results.distance'></resultoptions>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class='kla-piecharts'>\r" +
    "\n" +
    "                <h4 class='text-center kla-pie-header'>Pie Chart Visualizations</h4>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div ng-repeat=\"layout in results.distance.seriesData.seriesLabels track by $id($index)\" class='kla-pie-container'>\r" +
    "\n" +
    "                    <piechart width=\"400px\" height=\"330px\" source=\"results.distance\" series=\"$index\"></piechart>\r" +
    "\n" +
    "                    <div class='kla-pie-label'>{{layout}}</div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class='tab-pane' id='fingerUsage'>\r" +
    "\n" +
    "            <seriesbarchart width=\"940px\" height=\"300px\" source=\"results.fingerUsage\"></seriesbarchart>\r" +
    "\n" +
    "            <resulttable source='results.fingerUsage'></resulttable>\r" +
    "\n" +
    "            <resultoptions source='results.fingerUsage'></resultoptions>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class='kla-piecharts'>\r" +
    "\n" +
    "                <h4 class='text-center kla-display-opts-header'>Pie Chart Visualizations</h4>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div ng-repeat=\"layout in results.fingerUsage.seriesData.seriesLabels track by $id($index)\" class='kla-pie-container'>\r" +
    "\n" +
    "                    <piechart width=\"400px\" height=\"330px\" source=\"results.fingerUsage\" series=\"$index\"></piechart>\r" +
    "\n" +
    "                    <div class='kla-pie-label'>{{layout}}</div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class='tab-pane' id='rowUsage'>\r" +
    "\n" +
    "            <seriesbarchart width=\"940px\" height=\"300px\" source=\"results.rowUsage\"></seriesbarchart>\r" +
    "\n" +
    "            <resulttable source='results.rowUsage'></resulttable>\r" +
    "\n" +
    "            <resultoptions source='results.rowUsage'></resultoptions>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class='kla-piecharts'>\r" +
    "\n" +
    "                <h4 class='text-center kla-display-opts-header'>Pie Chart Visualizations</h4>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div ng-repeat=\"layout in results.rowUsage.seriesData.seriesLabels track by $id($index)\" class='kla-pie-container'>\r" +
    "\n" +
    "                    <piechart width=\"400px\" height=\"330px\" source=\"results.rowUsage\" series=\"$index\"></piechart>\r" +
    "\n" +
    "                    <div class='kla-pie-label'>{{layout}}</div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class='tab-pane' id='heatMaps'>\r" +
    "\n" +
    "            <div class='text-center'>\r" +
    "\n" +
    "                <div id='heatmap-{{$index}}' ng-repeat='layout in results.layouts' class=\"keyboard\">\r" +
    "\n" +
    "                    <keyboardheatmap current=\"currentHeatmap\" myindex=\"{{$index}}\" layout=\"layout\" keydata=\"results.keyData[$index]\"></keyboardheatmap>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <paginate start=\"1\" stop=\"6\" handler=\"switchHeatmap\"></paginate>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <table class=\"table table-striped\">\r" +
    "\n" +
    "                    <thead>\r" +
    "\n" +
    "                        <tr>\r" +
    "\n" +
    "                            <th>Rank</th>\r" +
    "\n" +
    "                            <th>Key</th>\r" +
    "\n" +
    "                            <th>Presses</th>\r" +
    "\n" +
    "                        </tr>\r" +
    "\n" +
    "                    </thead>\r" +
    "\n" +
    "                    <tbody>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                        <tr ng-repeat=\"key in results.keyData[currentHeatmap]  | orderBy:['-count', 'primary']\">\r" +
    "\n" +
    "                            <td>\r" +
    "\n" +
    "                                #{{$index+1}}\r" +
    "\n" +
    "                            </td>\r" +
    "\n" +
    "                            <td>\r" +
    "\n" +
    "                                {{getKeyLabel(key.primary, key.shift, key.altGr, key.shiftAltGr)}}\r" +
    "\n" +
    "                            </td>\r" +
    "\n" +
    "                            <td>\r" +
    "\n" +
    "                                {{key.count}}\r" +
    "\n" +
    "                            </td>\r" +
    "\n" +
    "                        </tr>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </tbody>\r" +
    "\n" +
    "                </table>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class='tab-pane' id='miscellaneous'>\r" +
    "\n" +
    "            <div class=\"kla-misc-box\">\r" +
    "\n" +
    "                <strong>Consecutive Finger Use</strong> - \r" +
    "\n" +
    "                How often the same finger is used to type a key as was used to type the previous key.\r" +
    "\n" +
    "                An example of this would be typing \"fg\" on QWERTY. When looking at \"g\", the program notes that  the index finger\r" +
    "\n" +
    "                was also previously used to type \"f\". The lower the number the better.\r" +
    "\n" +
    "                <p></p>\r" +
    "\n" +
    "                <label><input class='kla-result-checkbox' ng-model=\"settings.cfuIgnoreDups\" type=\"checkbox\" /> Include instances of the same key being pressed twice in a row (example: typing \"ff\").</label>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <seriesbarchart width=\"940px\" height=\"300px\" source=\"results.consecFingerPress\"></seriesbarchart>\r" +
    "\n" +
    "            <resulttable source='results.consecFingerPress'></resulttable>\r" +
    "\n" +
    "            <resultoptions source='results.consecFingerPress' displayopts=false></resultoptions>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class='kla-misc-spacing'></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"kla-misc-box\">\r" +
    "\n" +
    "                <strong>Consecutive Hand and Thumb Use</strong> - \r" +
    "\n" +
    "                How often the same hand was used to type a key as was used to type the previous key (thumbs are grouped as a separate entity). An example of this would be typing \"af\" on QWERTY. When looking at \"f\", the program notes that the left hand was also previously used to type \"a\". The lower the number the better.\r" +
    "\n" +
    "                <p></p>\r" +
    "\n" +
    "                <label><input class='kla-result-checkbox' ng-model=\"settings.chuIgnoreDups\" type=\"checkbox\" /> Include instances of the same key being pressed twice in a row (example: typing \"ff\").</label>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <seriesbarchart width=\"940px\" height=\"300px\" source=\"results.consecHandPress\"></seriesbarchart>\r" +
    "\n" +
    "            <resulttable source='results.consecHandPress'></resulttable>\r" +
    "\n" +
    "            <resultoptions source='results.consecHandPress' displayopts=false></resultoptions>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class='kla-misc-spacing'></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"kla-misc-box\">\r" +
    "\n" +
    "                <strong>Modifier Key Use</strong> - \r" +
    "\n" +
    "                How often the Shift, AltGr, and Shift+AltGr modifiers are used with characters in the text.\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <seriesbarchart width=\"940px\" height=\"300px\" source=\"results.modifierUse\"></seriesbarchart>\r" +
    "\n" +
    "            <resulttable source='results.modifierUse'></resulttable>\r" +
    "\n" +
    "            <resultoptions source='results.modifierUse' displayopts=false></resultoptions>\r" +
    "\n" +
    "            <div style='padding:30px;font-size:16px;' class='text-center'>\r" +
    "\n" +
    "                <p>\r" +
    "\n" +
    "                    Additional statistics will be coming to this section later this year. \r" +
    "\n" +
    "                </p>\r" +
    "\n" +
    "                <p>\r" +
    "\n" +
    "                    I hate these sort of place holder messages, however, I figured I'd make a note so you'd know where to look in coming updates.\r" +
    "\n" +
    "                </p>\r" +
    "\n" +
    "                <p>\r" +
    "\n" +
    "                    If you have any suggestions feel free to email me.\r" +
    "\n" +
    "                </p>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class='tab-pane' id='personalized'>\r" +
    "\n" +
    "            <div class='text-center'>\r" +
    "\n" +
    "                <keyboarddisplay layout='results.personalized' class='show-inline'><keyboarddisplay>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div style='margin:0 auto;width:750px'>\r" +
    "\n" +
    "                <p >\r" +
    "\n" +
    "                    <h3 class='text-center'>Personalized Layout</h3>\r" +
    "\n" +
    "                </p>\r" +
    "\n" +
    "                <p>\r" +
    "\n" +
    "                    And now just for fun, here is what the optimal layout of your keyboard would be if it were tailored to fit the way you type. This personalized layout is based only on a frequency analysis. It places your most commonly typed characters in the most optimal spots and your least typed characters in the least optimal spots - however, for practical reasons, I have frozen certain keys. The more you type, the more accurate this layout will be. I should note that the generated design does not take into account how often you switch hands while typing or how close together common letter pairings are. Most modern layouts take into account ergonomic considerations as well as key usage.\r" +
    "\n" +
    "                </p>\r" +
    "\n" +
    "                <p>\r" +
    "\n" +
    "                    Initially I was going to leave out this feature for the latest version of the analyzer, but I had some requests to keep it so I did. Since a complete ergonomic analysis isn't taken into account, the generated layout should be taken with a grain of salt, but it can give you some ideas of good key placements.\r" +
    "\n" +
    "                </p>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class='text-center try-again-btn'>\r" +
    "\n" +
    "        <button class=\"btn btn-large\" type=\"button\" ng-click=\"returnToInput()\">Try Another Input</button>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );

}]);
