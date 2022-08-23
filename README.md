
# karabiner-configs

helped me stop frustrating after moving on mac after many years on windows.

## WINDOWS LIKE KEYBOARD (fn(ctrl for non apple keyboards) > left_command, ctrl+tab, ctrl+arrows behavior)
makes mac keyboard shortcuts in most programs work like on windows with normal keyboard
(fn+A = windows-like ctrl+A (actual cmd+A), ...)

## RDP, Virtual Machines (alt > win, cmd > alt, fn <> ctrl for apple keyboards)
in some Virtual Machine hosts I use make keyboard windows-like again

## RShift + Backspace = Delete (word with fn) for apple keyboards

## RShift + Enter = Insert

## RAlt + F7-F12 = media
for people with long fingers

## NUMPAD SIMUL: RAlt + k,./l;'op[ = keypad_0-9 [9]>[/] [0]>[*] ']'>[.]
simulation of numpad

currently rewriten using https://github.com/esamattis/deno_karabiner

# Deno Karabiner


Write Complex Modifications for
[Karabiner-Elements](https://karabiner-elements.pqrs.org/) using TypeScript
and [Deno](https://deno.land/).

## Why?

Karabiner Complex Modifications are in JSON which is not too text editor
friendly format. By moving to TypeScript we gain following:

-   Ability write comments
-   Ability to use variables and any logic we want
-   Autocomplete and build via VSCode etc.
-   Type safety. The key codes etc. are typed
-   Although this is not 100% complete. PRs welcome!

Why Deno? It's the simplest way to run TypeScript code on macOS. No need to
fiddle with npm and TypeScript configs.


Build with VSCode tasks
! IT WILL OVERWRITE your default config under `~/.config/karabiner/karabiner.json`.
