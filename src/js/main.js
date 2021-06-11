const MiroTextHelper = require("./MiroTextHelper");


const icon = '<circle cx="12" cy="12" r="9" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2"></circle>';

miro.onReady(() => {
  miro.initialize({ 
    extensionPoints: {
      bottomBar: async () => {
        const authorized = await miro.isAuthorized()
        
        if (authorized) {

          initializeMetrics();

          return {
            title: 'Authorized example',
            svgIcon: icon,
            onClick: sayHi,
          }
        } else {
          return miro.authorize({
            'response_type': 'code',
          }).then( () => {
            return {
              title: 'Authorized example',
              svgIcon: icon,
              onClick: sayHi,
            }
          });
        }
      },
    },
  })
})


// todo: move !

const SHAPE_MARKER_START = '[<';
const SHAPE_MARKER_END = '>]';

function initializeMetrics() {
  miro.board.widgets.get({type: 'shape'}).then ( data => {
    console.log ( "---- Found Kanban Shapes ---");
    data
      .filter ( shape => MiroTextHelper.textIsShapeMarker ( shape.plainText ) )
      .map ( shape => MiroTextHelper.getShapeName ( shape.plainText ))
      .forEach (
        // todo: initialize collision detection data structure 
        text => console.log ( text )
      );
    console.log ( "-----END----")
  })
}



function sayHi() {
  miro.board.widgets.create({type: 'sticker', text: "whatever we want"})
  alert('Hi!')
}
