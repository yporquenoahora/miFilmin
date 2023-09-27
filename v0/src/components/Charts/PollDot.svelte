<script>
    import { getContext, onMount, onDestroy, afterUpdate } from 'svelte';
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
  
    export let x = 0;
    export let y = 0;
    export let radius = 4;
    export let color = '#000000';
    export let alpha = 1;
    export let contextName = 'canvas';
  
    const { register, deregister, invalidate } = getContext(contextName);

    const tAlpha = tweened(null, {
      duration: 200,
      delay: Math.random() * 200,
      easing: cubicOut
    });



    function draw(ctx) {
      ctx.fillStyle = color;
      ctx.globalAlpha = $tAlpha;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
      ctx.fill();
    }
  
    onMount(() => {
      register(draw);
      invalidate();
      
      return () => {
        deregister(draw);
      };
    });
  
    afterUpdate(invalidate);

    onDestroy(invalidate);

    $: tAlpha.set(alpha);
  </script>