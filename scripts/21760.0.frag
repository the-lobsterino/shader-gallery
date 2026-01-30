#ifdef GL_ES
precision mediump float;
#endif

void main(void)
{
    float x = 500.0;
    float y = 200.0;
    float height = 50.0;
    float width = 100.0;
    
    if(all(greaterThanEqual(gl_FragCoord.xy, vec2(x, y))) && all(lessThanEqual(gl_FragCoord.xy, vec2(x + width, y + height))))
    {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
    else
    {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
}