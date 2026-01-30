// Seriously people... 
// No really
// Don't do that... ever... or just for fun
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;

#define X_MARGIN (20.0)
#define Y_MARGIN (5.0)
#define FIELD_WIDTH  (120.0)
#define FIELD_HEIGHT (90.0)
#define LINE_THICKNESS (0.12)
#define GOAL_WIDTH (18.3)
#define GOAL_AREA_WIDTH (5.5)
#define PENALTY_WIDTH (16.5)
#define PENALTY_HEIGHT (40.3)
#define CORNER_RADIUS (1.0)
#define PENALTY_CENTER (11.0)
#define PENALTY_CENTER_RADIUS (9.15)
#define CENTER_RADIUS 9.15
#define DOT_RADIUS 0.5

#define H_WIDTH  (FIELD_WIDTH/2.0)
#define H_HEIGHT (FIELD_HEIGHT/2.0)
#define H_LINE_THICKNESS (LINE_THICKNESS/2.0)
#define H_GOAL_WIDTH (GOAL_WIDTH/2.0)
#define H_PENALTY_HEIGHT (PENALTY_HEIGHT/2.0)


bool isInLine(vec2 pos) {
    bool res = false;
    
    // no computation for external pixels
    if(pos.x > H_WIDTH + H_LINE_THICKNESS ||
       pos.y > H_HEIGHT + H_LINE_THICKNESS) {
        res = false;    
    } else {
        // goal line
        if(pos.x > H_WIDTH - H_LINE_THICKNESS){
            res = true; 
        }
        // touch line
        if(pos.y > H_HEIGHT - H_LINE_THICKNESS){
            res = true; 
        }
        // center line
        if(pos.x < H_LINE_THICKNESS) {
            res = true; 
        }
        
        float d = length(pos);
        // center circle
        if (d < CENTER_RADIUS + H_LINE_THICKNESS && 
            d > CENTER_RADIUS - H_LINE_THICKNESS) {
            res = true;
        }
        // center dot
        if (d < DOT_RADIUS) {
            res = true;
        }
        
        // goal line
        if(pos.x > H_WIDTH - GOAL_AREA_WIDTH - H_LINE_THICKNESS){
            // front line
            if(pos.x < H_WIDTH - GOAL_AREA_WIDTH + H_LINE_THICKNESS &&
                   pos.y < H_GOAL_WIDTH) {
                res = true; 
            }
            // side line
            if(pos.y < H_GOAL_WIDTH + H_LINE_THICKNESS &&
               pos.y > H_GOAL_WIDTH - H_LINE_THICKNESS) {
                res = true; 
            }
        }
            
        
        // penalty line
        float pd = distance(pos.xy,vec2(H_WIDTH - PENALTY_CENTER,0.0)); 
        if(pos.x > H_WIDTH - PENALTY_WIDTH - H_LINE_THICKNESS){
            // front line
            if(pos.x < H_WIDTH - PENALTY_WIDTH + H_LINE_THICKNESS &&
                   pos.y < H_PENALTY_HEIGHT) {
                res = true; 
            }
            
            // side line
            if(pos.y < H_PENALTY_HEIGHT + H_LINE_THICKNESS &&
               pos.y > H_PENALTY_HEIGHT - H_LINE_THICKNESS) {
                res = true; 
            }
            
            if (pd < DOT_RADIUS) {
                return true;    
            }
            
        } else { // penalty semi-circle
            if (pd < PENALTY_CENTER_RADIUS + H_LINE_THICKNESS &&
                pd > PENALTY_CENTER_RADIUS - H_LINE_THICKNESS ) {
                return true;    
            }
        }
        
        // corner circle
        float cd = distance(pos.xy,vec2(H_WIDTH,H_HEIGHT));
        if (cd  < CORNER_RADIUS + H_LINE_THICKNESS &&
            cd  > CORNER_RADIUS - H_LINE_THICKNESS) {
            res = true;
        }
         
        
        
    }
    return res;
}


void main( void ) {

    vec2 uv = ( gl_FragCoord.xy /resolution.xy );
    // put the coordinate space in center of screen 
    // and miror on X and Y
    vec2 pos = (abs(uv - vec2(0.5))); 
    
    // transform the uv coordinate to express them in "real world units"
    // and fit them to the available space
    if(resolution.x/resolution.y > (FIELD_WIDTH + X_MARGIN)/(FIELD_HEIGHT + Y_MARGIN)) {
        pos.x *= resolution.x / resolution.y;
        pos.y *= resolution.y / resolution.y;
        pos *= FIELD_HEIGHT + Y_MARGIN;
    } else {
        pos.x *= resolution.x / resolution.x;
        pos.y *= resolution.y / resolution.x;
        pos *= FIELD_WIDTH + X_MARGIN;       
    }
    vec3 color = vec3(0.0);
    if (isInLine(pos)) {
        color = vec3(1.0);
    }

    gl_FragColor = vec4(color,1.0);

}