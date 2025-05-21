
export default defineAppConfig({
  ui: {
    accordion: {
      slots: {
        leadingIcon: "size-4",
        trailingIcon: "-rotate-90 group-data-[state=open]:rotate-0 duration-400 data-[disabled]:invisible",
        trigger: "font-normal text-sm py-3",
        header: "text-sm",
        item: "text-sm"
      },
      variants: {
        disabled: {
          true: {
            trigger: "opacity-100"
          }
        }
      }
    },
    breadcrumb: {
      variants: {
        active: {
          true: {
            link: "text-default font-medium"
          }
        }
      }
    },
    button: {
      slots: {
        base: ["hover:bg-primary cursor-pointer disabled:cursor-auto", "transition"],
        leadingIcon: "size-4"
      },
      variants: {
        size: {
          md: {
            leadingIcon: "size-4"
          }
        }
      },
      compoundVariants: [
        {
          color: "primary",
          variant: "solid",
          class: "hover:bg-primary"
        }
      ]
    },
    colors: {
      success: "emerald",
      info: "cyan",
      error: "red",
      neutral: "zinc"
    },
    formField: {
      slots: {
        help: "mt-1 font-light"
      }
    },
    input: {
      slots: {
        base: ["file:font-normal"],
        // trailing: "text-xs font-medium text-gray-400"
      }
    },
    radioGroup: {
      slots: {
        item: "py-2 px-3"
      },
      compoundVariants: [
        {
          size: "md",
          class: {
            item: "px-3 py-2"
          }
        }
      ]
    },
    select: {
      slots: {
        base: ["cursor-pointer"]
      }
    },
    table: {
      slots: {
        td: "py-3"
      }
    },
    tabs: {
      slots: {
        content: "pl-4"
      }
    }
  }
});
