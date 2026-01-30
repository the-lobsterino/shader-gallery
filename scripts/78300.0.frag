/*
    self#profilepic,
    basic grid

    2021, masterzorag
*/

precision mediump float;

uniform float time;
varying vec4  fragColor;


void main (void)
{
    vec2 st   = gl_FragCoord.xy/480.; // 0-1
    
    vec2 grid = abs(st.xy * 7.);
    float idx = grid.x;
    vec3 col = vec3(.0, .0, .0);

    // y = 0/1, even/odd
    
    // don't draw first and last coloumn
    if(grid.x <= 1.0 || grid.x >= 6.0){
        col.b = .0;
    } else
    // 2nd and 6th col
    if((grid.x <= 2. || grid.x >= 5.0)
    && (grid.y <= 5. && grid.y >= 1.0))
    {
        col.r = 1.; // paint
    }
    else // 3rd and 5th coloumn
    if((grid.x <= 3. || grid.x >= 4.0)
    &&((grid.y <= 2. && grid.y >= 1.0)
    || (grid.y <= 4. && grid.y >= 3.0) ))
    {
        col.r = 1.;
    }
    else // middle coloumn
    if((grid.x <= 4. && grid.x >= 3.0)
    && (grid.y <= 6. && grid.y >= 3.0))
    {
        col.r = 1.; // paint
    }
    //else // other stuff
    if(idx <= 4.0){
        col.b = 0.;
    } else if(idx <= 5.0){
        col.b = 1.;
    } else if(idx <= 6.0){
        col.b = 0.;
    } else if(idx <= 7.0){
        col.b = 0.;
    }

    col.b = idx /7.;

    gl_FragColor = vec4(col, 1.0);

    gl_FragColor.r *= (sin(time));
}
